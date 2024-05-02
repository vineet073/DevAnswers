/* eslint-disable no-unused-vars */
'use server'

import Interaction from "@/models/interaction.model";
import Question from "@/models/question.model";
import { ViewQuestionParams } from "@/types/shared.types";
import { getQuestionsById } from "./question.action";


export async function  viewQuestion (params:ViewQuestionParams){
    const {questionId,userId}=params;

    try {
        if(userId){
                const existingInteraction=await Interaction.findOne({user:userId,question:questionId});
            
                if(!existingInteraction){
                    const updatedQuestion=await Question.findByIdAndUpdate(questionId,{$inc:{views:1}},{new:true});
                    const newInteraction=await Interaction.create({
                        user:userId,
                        action:'view',
                        question:questionId
                    });
                }           
        } 
    } catch (error) {
        // throw new error;
        console.log("error while viewing question:",error);
    }
    
}