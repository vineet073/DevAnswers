'use server'

import { SearchParams } from "@/types/shared.types";
import { connectDatabase } from "../database/connectDatabase";
import Question from "@/models/question.model";
import User from "@/models/user.model";
import Answer from "@/models/answer.model";
import Tag from "@/models/tag.model";


const searchableTypes = ['question', 'answer', 'user', 'tag'];
export const globalSearch=async(params:SearchParams)=>{
    
    try {
    connectDatabase();

    const{query,type}=params;
    let results=[];
    const modelsAndTypes = [
        {
        model: Answer,
        searchField: 'content',
        type: 'answer'
        },
        {
        model: Tag,
        searchField: 'name',
        type: 'tag'
        },
        {
          model: Question,
          searchField: 'title',
          type: 'question'
        },
        {
          model: User,
          searchField: 'name',
          type: 'user'
        }
    ];

        const typeLower=type?.toLowerCase();
        const regexQuery={$regex:query, $options:'i'};

        if(!typeLower || !searchableTypes?.includes(typeLower)){
            for(const {model,searchField,type} of modelsAndTypes){
                const queryResults=await model.find({[searchField]:regexQuery})
                .limit(2);

                results.push(
                   ...queryResults.map((item)=>({
                        title:
                            type==='answer'? `Answers containing ${query}`:item[searchField],
                        type,
                        id:
                            type==='user'? item.clerkId : type==='answer'? item.questions : item._id
                    }))
                );;
            }
        }
        else{
            const modelInfo=modelsAndTypes.find((item)=>item.type===typeLower);

            if(!modelInfo){
                throw new Error('Invalid search type');
            }

            const queryResults=await modelInfo.model.find({[modelInfo.searchField]:regexQuery})
            .limit(8);

            results=queryResults.map((item)=>({
                title:
                    type==='answer'? `Answers containing ${query}`:item[modelInfo.searchField],
                type,
                id:
                    type==='user'? item.clerkId : type==='answer'? item.questions : item._id
            })
            );
        }

        return JSON.stringify(results);
    } catch (error) {
        throw new Error(String(error));
    }
}