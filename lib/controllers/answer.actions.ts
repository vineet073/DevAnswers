'use server'

import Answer from "@/models/answer.model"
import { AnswerVoteParams, CreateAnswerParams, DeleteAnswerParams, GetAnswersParams, GetUserStatsParams } from "../../types/shared.types"
import Question from "@/models/question.model";
import { revalidatePath } from "next/cache";
import { connectDatabase } from "../database/connectDatabase";
import User from "@/models/user.model";


export async function createAnswer(params:CreateAnswerParams) {

    try {
        connectDatabase();
        const{content,question,author,path}=params;

        const newAnswer=await Answer.create({
            content,
            question,
            author
        })
    
        const questionObject=await Question.findByIdAndUpdate({_id:question},{
            $push:{answers:newAnswer._id}
        });
    
        revalidatePath(path);
    
        return newAnswer 
    } catch (error) {
        console.log("error while creating answer:",error);
        throw error;
    }

    
}

export async function getAnswerByQId(params:GetAnswersParams){
    try {
        connectDatabase();

        const result=await Answer.find({question:params.questionId})
        .populate(
            {
                path:"author",model:User
            }
        ).sort({createdAt:-1})
        .exec();

        return result;
    } catch (error) {
        console.log("error while fetching answers:",error);
        throw error;
    }
}

export const upVoteAnswer=async(data:AnswerVoteParams)=>{
    try {
        connectDatabase();

        const{answerId,userId,hasupVoted,hasdownVoted,path}=data;

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
        const updatedanswerDetails=await Answer.findByIdAndUpdate(
            answerId,query,{new:true}
        );
        if(!updatedanswerDetails){
            throw new Error("answer not found");
        }

        revalidatePath(path);
    } catch (error:unknown) {
        console.log("error while upvoting answer:",error);
        throw error;
    }
}

export const downVoteAnswer=async(answerData:AnswerVoteParams)=>{
    try {
        connectDatabase();

        const{answerId,userId,hasupVoted,hasdownVoted,path}=answerData;

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


        const updatedanswerDetails=await Answer.findByIdAndUpdate(
            answerId,query,{new:true}
        );
        if(!updatedanswerDetails){
            throw new Error("answer not found");
        }

        revalidatePath(path);
    } catch (error:unknown) {
        console.log("error while upvoting answer:",error);
        throw error;
    }
}

export const getAnswersByUserId=async(answerData:GetUserStatsParams)=>{
    const {userId,page=1,pageSize=10}=answerData;
    try {
        connectDatabase();

        const totalAnswers=await Answer.countDocuments({author:userId});
        const answers=await Answer.find({author:userId})
        .populate(
        {    path:"author",model:User}
        )
        .populate({
            path:"question", model:Question
        }).sort({upvotes:-1,createdAt:-1})
        .exec();        

        console.log("answers:",answers);
        return {answers,totalAnswers};

    } catch (error) {
        console.log("error while getting answers:",error);
        throw error;        
    }
}

export const deleteAnswer=async(props:DeleteAnswerParams)=>{
    const {answerId,path}=props;

    try {
        connectDatabase();
        const answer=await Answer.findById(answerId);
        if(!answer){
            throw new Error("Answer not found");
        }
        await Question.findOneAndUpdate({answers:answerId},{$pull:{answers:answerId}});
        await Answer.deleteMany({answer:answerId});

        // await Interaction.deleteMany({question:questionId});

        revalidatePath(path);
    } catch (error) {
        console.log("error while deleting answer:",error);
        throw error;
    }
}