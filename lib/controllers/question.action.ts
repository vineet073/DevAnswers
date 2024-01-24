'use server'

import Question from "@/models/question.model";
import { connectDatabase } from "../database/connectDatabase"
import { CreateQuestionParams, GetQuestionByIdParams, GetQuestionsParams } from "./shared.types";
import Tag from "@/models/tag.model";
import { revalidatePath } from "next/cache";
import User from "@/models/user.model";

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

export const getQuestions=async(questionData:GetQuestionsParams)=>{
    try {
        connectDatabase();

        const questions=await Question.find({})
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
        }).exec();        

        return question;

    } catch (error) {
        console.log("error while getting questions:",error);
        throw error;        
    }
}