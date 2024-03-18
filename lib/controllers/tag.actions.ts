'use server'

import Tag from "@/models/tag.model";
import { connectDatabase } from "../database/connectDatabase";
import { GetAllTagsParams, GetQuestionsByTagIdParams, GetTopInteractedTagsParams } from "../../types/shared.types";
import { FilterQuery } from "mongoose";
import Question from "@/models/question.model";
import User from "@/models/user.model";


export async function getTopIneractedTags(params:GetTopInteractedTagsParams){
    try {
        connectDatabase();

        const tags=await Tag.find({});
        
        return tags;
    } catch (error) {
        console.log("error while getting all tags:",error);
        throw error;
    }
}

export async function getAllTags(params:GetAllTagsParams){
    try {
        connectDatabase();
        const tags=await Tag.find({});
        return {tags};
    } catch (error) {
        console.log("error while getting all tags:",error);
        throw error;
    }
}

export async function getQuestionsByTagId(params:GetQuestionsByTagIdParams){
    try {
        connectDatabase();
        const{tagId,page=1,pageSize=10,searchQuery}=params;
        const query:FilterQuery<typeof Question>=searchQuery?
        {title:{$regex:searchQuery,$options:'i'}}:{};

        const tag=await Tag.findById({_id:tagId}).populate({
            path:"questions",
            model:Question,
            match:query,
            options:{
                sort:{createdAt:-1}
            },
            populate:[
                {path:"author", model:User},
                {path:"tags",model:Tag}
            ]
        });
        console.log("tag:",tag); 

        if(!tag){
            throw Error("Tag not found");
        };

        const questions=tag.questions;
        return {tagTitle:tag.name,questions};


    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getTopTags(){
    try {
        connectDatabase();
        const tags=await Tag.aggregate([
            {$project:{name:1,questionCount:{$size:"$questions"}}}
        ]).sort({questionCount:-1}).limit(5)
        return tags;
    } catch (error) {
        console.log("error while getting all tags:",error);
        throw error;
    }
}