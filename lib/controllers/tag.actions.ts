/* eslint-disable no-unused-vars */
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
    const{searchQuery,filter,page=1,pageSize=32}=params;
    // const actualPage = searchQuery ? 1 : page || 1;
    const skipAmount = (page - 1) * pageSize;
    try {
        connectDatabase();
        const query:FilterQuery<typeof Tag>={};
        if(searchQuery){
            query.$or=[
                {name:{$regex:new RegExp(searchQuery,'i')}}
            ]
        }
        let sortOptions={};
        switch(filter){
            case 'recent':
                sortOptions={createdAt:-1};
                break;
            
            case 'old':
                sortOptions={createdAt:1};
                break;
            
            case 'name':
                sortOptions={name:1};
                break;
            
            case 'popular':
                sortOptions={questions:-1};
                break;
            
            default:
                break;
            
        }
        const tags=await Tag.find(query)
        .sort(sortOptions)
        .skip(skipAmount)
        .limit(pageSize);

        const totalTags=await Tag.countDocuments(query);
        const isNext=totalTags > tags.length + skipAmount;

        return {tags, isNext};
    } catch (error) {
        console.log("error while getting all tags:",error);
        throw error;
    }
}

export async function getQuestionsByTagId(params:GetQuestionsByTagIdParams){
    const{tagId,page=1,pageSize=10,searchQuery}=params;
    // const actualPage = searchQuery ? 1 : page || 1;
    const skipAmount = (page - 1) * pageSize;
    try {
        connectDatabase();
        const query:FilterQuery<typeof Question>=searchQuery?
        {title:{$regex:searchQuery,$options:'i'}}:{};

        const tag=await Tag.findById({_id:tagId}).populate({
            path:"questions",
            model:Question,
            match:query,
            options:{
                sort:{createdAt:-1},
                skip:skipAmount,
                limit:pageSize
            },
            populate:[
                {path:"author", model:User},
                {path:"tags",model:Tag}
            ]
        });
        
        if(!tag){
            throw Error("Tag not found");
        };

        const questions=tag.questions;
        const totalQuestions=await Tag.countDocuments(query);
        const isNext=totalQuestions > questions.length + skipAmount;

        return {tagTitle:tag.name, questions, isNext};
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