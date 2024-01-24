import Tag from "@/models/tag.model";
import { connectDatabase } from "../database/connectDatabase";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";


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
        
    }
}