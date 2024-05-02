/* eslint-disable no-unused-vars */
'use server'

import User from "@/models/user.model";
import { connectDatabase } from "../database/connectDatabase";
import { CreateUserParams, GetAllUsersParams, GetSavedQuestionsParams, GetUserByIdParams, GetUserStatsParams, ToggleSaveQuestionParams, UpdateUserParams } from "../../types/shared.types";
import { revalidatePath } from "next/cache";
import { FilterQuery } from "mongoose";
import Question from "@/models/question.model";
import Tag from "@/models/tag.model";
import Answer from "@/models/answer.model";
import { BadgeCriteriaType } from "@/types/types";
import { count } from "console";
import { assignBadges } from "../utility";


export async function createUser(userData:CreateUserParams){
    try {
        connectDatabase();

        const newUser=await User.create(userData);

        return newUser;
    } catch (error) {
        console.log("error while creating new user:",error);
        throw error;
    }
}

export async function updateUser(userData:UpdateUserParams){
    try {
        connectDatabase();

        const {clerkId,updateData,path}=userData

        const updatedUser=await User.findOneAndUpdate({clerkId},updateData,{new:true});

        revalidatePath(path);
        return updatedUser;
    } catch (error) {
        console.log("error while creating new user:",error);
        throw error;
    }
}

export async function getUserByClerkId(userId:any){
    try {
        connectDatabase();

        const user=await User.findOne({clerkId:userId});
        
        return user;
    } catch (error) {
        console.log("error while getting user by clerk id:",error);
        throw error;
    }
}

export async function getProfileData(params:GetUserByIdParams){
    try {
        const {userId}=params;
        connectDatabase();

        const user=await User.findOne({clerkId:userId});

        if(!user){
            throw new Error("User not found");
        }
        const questionCount=await Question.countDocuments({author:user._id});
        const answerCount=await Answer.countDocuments({author:user._id});

        const questionUpVotes=await Question.aggregate([
            {
                $match:{author:user._id}
            },
            {
                $group:{
                    _id:null,
                    totalUpvotes:{$sum:{$size:"$upvotes"}}
                }
            }
        ]);
        console.log("questionUpVotes:",questionUpVotes);

        const totalAnswerUpvotes=await Answer.aggregate([
            {
                $match:{author:user._id}
            },
            {
                $group:{
                    _id:null,
                    totalUpvotes:{$sum:{$size:"$upvotes"}}
                }
            }
        ]);

        const questionViews=await Question.aggregate([
            {
                $match:{author:user._id}
            },
            {
                $group:{
                    _id:null,
                    totalViews:{$sum:"$views"}
                }
            }
        ]);

        const criteria=[
            {type:"QUESTION_COUNT" as BadgeCriteriaType, count:questionCount},
            {type:"ANSWER_COUNT" as BadgeCriteriaType, count:answerCount},
            {type:"QUESTION_UPVOTES" as BadgeCriteriaType, count:questionUpVotes[0]?.totalUpvotes || 0},
            {type:"ANSWER_UPVOTES" as BadgeCriteriaType, count:totalAnswerUpvotes[0]?.totalUpvotes || 0},
            {type:"TOTAL_VIEWS" as BadgeCriteriaType, count:questionViews[0]?.totalViews || 0}
        ]

        const badgeCounts=assignBadges({criteria});

        return{user,questionCount,answerCount,badgeCounts,reputation:user.reputation};
    } catch (error) {
        console.log("error while getting profile data:",error);
        throw error;
    }
}

export async function getAllUser(params:GetAllUsersParams){
    const{searchQuery,filter,page=1,pageSize=10}=params;
    // const actualPage = searchQuery ? 1 : page || 1;
    const skipAmount = (page - 1) * pageSize;
    try {
        connectDatabase();
        const query:FilterQuery<typeof User>={};
        if(searchQuery){
            query.$or=[
                {name:{$regex:new RegExp(searchQuery,'i')}},
                {username:{$regex:new RegExp(searchQuery,'i')}}
            ]
        }

        let sortOptions={};

        switch(filter){
            case 'new_users':
                sortOptions={joinAt:-1};
                break;
            
            case 'old_users':
                sortOptions={joinAt:1};
                break;
            
            case 'top_contributors':
                sortOptions={reputation:-1};
                break;
            
            default:
                break;
        }

        const users=await User.find(query)
        .skip(skipAmount)
        .limit(pageSize)
        .sort(sortOptions);

        const totalUsers=await User.countDocuments(query);
        const isNext=totalUsers > users.length + skipAmount;

        return {users,isNext};
    } catch (error) {
        console.log("error while getting all users:",error);
        throw error;
    }
}

export async function saveQuestion(params:ToggleSaveQuestionParams){
    try {
        connectDatabase();

        const {userId,questionId,path}=params;

        const user=await User.findById(userId);
        
;        if(user.saved.includes(questionId)){
           const updatedUser =await User.findByIdAndUpdate(userId,{
                $pull:{saved:questionId}
            })
            if(!updatedUser){
                throw new Error("Error while saving question");
            }
        }else{
           const updatedUser =await User.findByIdAndUpdate(userId,{
                $addToSet:{saved:questionId}
            },{new:true});
            if(!updatedUser){
                throw new Error("Error while saving question");
            }
        }        
        
        revalidatePath(path);
    } catch (error) {
        console.log("error while saving question:",error);
        throw error;
    }
}

export async function fetchSavedQuestions(params:GetSavedQuestionsParams){
    const {clerkId,page=1,pageSize=10,filter,searchQuery}=params;
    // const actualPage = searchQuery ? 1 : page || 1;
    const skipAmount = (page - 1) * pageSize;

    const query:FilterQuery<typeof Question>=searchQuery?
    {title:{$regex:new RegExp(searchQuery,'i')}}
    :{};

    let sortOptions={};
    switch(filter){
        case 'most_recent':
            sortOptions={createdAt:-1};
            break;
        
        case 'oldest':
            sortOptions={createdAt:1};
            break;
        
        case 'most_voted':
            sortOptions={upvotes:-1};
            break;
        
        case 'most_viewed':
            sortOptions={views:-1};
            break;
        
        case 'most_answered':
            sortOptions = { answers: -1 };
            break;
        
        default:
            break;
        
    }

    const updatedUser=await User.findOne({clerkId}).populate({
        path:'saved',
        model:Question,
        match:query,
        options:{
            sort:sortOptions,
            skip:skipAmount,
            limit:pageSize
        },
        populate:[
            {path:"tags", model:Tag},
            {path:"author", model:User}
        ]
    });

    if(!updatedUser){
        throw new Error('User not found');
    }
    const savedQuestions=updatedUser.saved;

    const totalSavedQuestions=await User.countDocuments(query);
    const isNext=totalSavedQuestions > savedQuestions.length + skipAmount;

    return {savedQuestions,isNext};
    
}

export async function getUserStats(params:GetUserStatsParams){
    try {
        const {userId,page=1,pageSize=10}=params;
        connectDatabase();

        const questionCount=await Question.countDocuments({author:userId});
        const answerCount=await Answer.countDocuments({author:userId});

        return{questionCount,answerCount};
    } catch (error) {
        console.log("error while getting user stats:",error);
        throw error;
    }
}
