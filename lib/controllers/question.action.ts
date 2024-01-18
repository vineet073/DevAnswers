'use server'

import Question from "@/models/question.model";
import { connectDatabase } from "../database/connectDatabase"
import { CreateQuestionParams } from "./shared.types";
import Tag from "@/models/tag.model";
import { revalidatePath } from "next/cache";

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