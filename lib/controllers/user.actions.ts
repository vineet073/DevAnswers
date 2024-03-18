'use server'

import User from "@/models/user.model";
import { connectDatabase } from "../database/connectDatabase";
import { CreateUserParams, GetAllUsersParams, GetSavedQuestionsParams, GetUserByIdParams, GetUserStatsParams, ToggleSaveQuestionParams, UpdateUserParams } from "../../types/shared.types";
import { revalidatePath } from "next/cache";
import { FilterQuery } from "mongoose";
import Question from "@/models/question.model";
import Tag from "@/models/tag.model";
import Answer from "@/models/answer.model";


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

        return{user,questionCount,answerCount};
    } catch (error) {
        console.log("error while getting profile data:",error);
        throw error;
    }
}

export async function getAllUser(params:GetAllUsersParams){
    try {
        connectDatabase();

        const users=await User.find({});

        return {users};
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

    const query:FilterQuery<typeof Question>=searchQuery?
    {title:{$regex:new RegExp(searchQuery,'i')}}
    :{};

    const updatedUser=await User.findOne({clerkId}).populate({
        path:'saved',
        model:Question,
        match:query,
        options:{
            createdAt:-1
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
    return {savedQuestions};
    
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
