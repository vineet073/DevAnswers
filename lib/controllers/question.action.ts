'use server'

import { connectDatabase } from "../database/connectDatabase"

export const createQuestion=async()=>{
    connectDatabase();
}