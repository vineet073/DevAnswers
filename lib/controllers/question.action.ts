'use server'

import Question from "@/models/question.model";
import { connectDatabase } from "../database/connectDatabase"
import { CreateQuestionParams, DeleteQuestionParams, EditQuestionParams, GetQuestionByIdParams, GetQuestionsParams, GetUserStatsParams, QuestionVoteParams } from "../../types/shared.types";
import Tag from "@/models/tag.model";
import { revalidatePath } from "next/cache";
import User from "@/models/user.model";
import Answer from "@/models/answer.model";
import Interaction from "@/models/interaction.model";
import { FilterQuery } from "mongoose";


export const createQuestion=async(data:CreateQuestionParams)=>{
    try {
        connectDatabase();

        const {title,content,tags,author,path}=data;

        const question=await Question.create({
            title,content,author
        });

        const tagDocuments=[];
        for(const tag of tags){
            const existingTag=await Tag.findOneAndUpdate(
                {
                    name:{
                        $regex:new RegExp(`^${tag}$`,'i')
                    }
                },
                {$setOnInsert:{name:tag} , $push:{questions:question._id}},
                {upsert:true,new:true}
            );

            tagDocuments.push(existingTag._id);
        }

        await Question.findByIdAndUpdate(question._id,{
            $push:{tags:{$each:tagDocuments}}
        });

        revalidatePath(path);
    } catch (error) {
        
    }
}

export const editQuestion=async(data:EditQuestionParams)=>{
    try {
        connectDatabase();

        const {title,content,tags,path,questionId}=data;

        const question=await Question.findById(questionId);
        const tagDocuments=[];
        for(const tag of tags){
            const existingTag=await Tag.findOneAndUpdate(
                {
                    name:{
                        $regex:new RegExp(`^${tag}$`,'i')
                    }
                },
                {$setOnInsert:{name:tag} , $addToSet:{questions:question._id}},
                {upsert:true,new:true}
            );

            tagDocuments.push(existingTag._id);
        }

        await Question.findByIdAndUpdate(question._id,
        {
            title,content
        },
        {
            $push:{tags:{$each:tagDocuments}}
        });

        revalidatePath(path);
    } catch (error) {
        
    }
}

export const getQuestions=async(questionData:GetQuestionsParams)=>{
    const {searchQuery,filter,page=1,pageSize=10}=questionData;
    try {
        connectDatabase();

        const query:FilterQuery<typeof Question>={};
        if(searchQuery){
            query.$or=[
                {title:{$regex:new RegExp(searchQuery,'i')}},
                {content:{$regex:new RegExp(searchQuery,'i')}}
            ]
        }
        const questions=await Question.find(query)
        .sort({createdAt:-1})
        .populate(
        {    path:"author",model:User}
        )
        .populate({
            path:"tags", model:Tag
        }).exec();

        return {questions};

    } catch (error) {
        console.log("error while getting questions:",error);
        throw error;        
    }
}

export const getQuestionsById=async(questionData:GetQuestionByIdParams)=>{
    const {questionId}=questionData;
    try {
        connectDatabase();

        const question=await Question.findById({_id:questionId})
        .populate(
        {    path:"author",model:User}
        )
        .populate({
            path:"tags", model:Tag
        })
        .populate({
            path:"answers", model:Answer
        }).exec();        

        return {question};

    } catch (error) {
        console.log("error while getting questions:",error);
        throw error;        
    }
}

export const upVoteQuestion=async(questionData:QuestionVoteParams)=>{
    try {
        connectDatabase();

        const{questionId,userId,hasupVoted,hasdownVoted,path}=questionData;

        let query={};
        if(hasupVoted){
            query={$pull:{upvotes:userId}};
        }else if(hasdownVoted){
            query={
                $pull:{downvotes:userId},
                $addToSet:{upvotes:userId}
            }
        }else{
            query={$addToSet:{upvotes:userId}}
        };

        const updatedQuestionDetails=await Question.findByIdAndUpdate(
            questionId,query,{new:true}
        );
        if(!updatedQuestionDetails){
            throw new Error("Question not found");
        }

        revalidatePath(path);
    } catch (error:unknown) {
        console.log("error while upvoting question:",error);
        throw error;
    }
}

export const downVoteQuestion=async(questionData:QuestionVoteParams)=>{
    try {
        connectDatabase();

        const{questionId,userId,hasupVoted,hasdownVoted,path}=questionData;

        let query={};
        if(hasdownVoted){
            query={$pull:{downvotes:userId}};
        }else if(hasupVoted){
            query={
                $pull:{upvotes:userId},
                $addToSet:{downvotes:userId}
            }
        }else{
            query={$addToSet:{downvotes:userId}}
        };

        const updatedQuestionDetails=await Question.findByIdAndUpdate(
            questionId,query,{new:true}
        );
        if(!updatedQuestionDetails){
            throw new Error("Question not found");
        }

        revalidatePath(path);
    } catch (error:unknown) {
        console.log("error while upvoting question:",error);
        throw error;
    }
}

export const getQuestionsByUserId=async(questionData:GetUserStatsParams)=>{
    const {userId,page=1,pageSize=10}=questionData;
    try {
        connectDatabase();

        const totalQuestions=await Question.countDocuments({author:userId});
        const questions=await Question.find({author:userId})
        .populate(
        {    path:"author",model:User}
        )
        .populate({
            path:"tags", model:Tag
        })
        .populate({
            path:"answers", model:Answer
        }).sort({views:-1,upvotes:-1,createdAt:-1})
        .exec();        

        return {questions,totalQuestions};

    } catch (error) {
        console.log("error while getting questions:",error);
        throw error;        
    }
}

export const deleteQuestion=async(props:DeleteQuestionParams)=>{
    const {questionId,path}=props;

    try {
        connectDatabase();
        const deletedQuestion=await Question.findByIdAndDelete(questionId);
        if(!deletedQuestion){
            throw new Error("Question not found");
        }
        await Answer.deleteMany({question:questionId});
        await Tag.updateMany({questions:questionId},{$pull:{questions:questionId}});
        await Interaction.deleteMany({question:questionId});

        revalidatePath(path);
    } catch (error) {
        console.log("error while deleting question:",error);
        throw error;
    }
}

// export const editQuestions=async(questionData:EditQuestionParams)=>{
//     const {questionId,title,content,tags,path}=questionData;
//     try {
//         connectDatabase();

//         const question=await Question.findByIdAndUpdate({_id:questionId},{
//             title,content
//         })

        
//         const tagDocuments=[];
//         for(const tag of tags){
//             const existingTag=await Tag.findOneAndUpdate(
//                 {
//                     name:{
//                         $regex:new RegExp(`^${tag}$`,'i')
//                     }
//                 },
//                 {$setOnInsert:{name:tag} , $push:{questions:question._id}},
//                 {upsert:true,new:true}
//             );

//             tagDocuments.push(existingTag._id);
//         }

//         await Question.findByIdAndUpdate(question._id,{
//             $push:{tags:{$each:tagDocuments}}
//         });

//         revalidatePath(path);
//         return question;

//     } catch (error) {
//         console.log("error while getting question:",error);
//         throw error;        
//     }
// }

export const getHotQuestions=async()=>{
    try {
        connectDatabase();

        const questions=await Question.find({})
        .sort({views:-1,upvotes:-1})
        .limit(5);

        return questions;

    } catch (error) {
        console.log("error while getting questions:",error);
        throw error;        
    }
}