'use server'

import User from "@/models/user.model";
import { connectDatabase } from "../database/connectDatabase";
import { CreateUserParams, UpdateUserParams } from "./shared.types";
import { revalidatePath } from "next/cache";


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

export async function getUserByClerkId(userID:any){
    try {
        connectDatabase();

        const user=await User.findOne({clerkId:userID});
        
        return user;
    } catch (error) {
        console.log("error while getting user by clerk id:",error);
        throw error;
    }
}