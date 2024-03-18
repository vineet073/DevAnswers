import * as z from 'zod';

export const questionSchema = z.object({
    title:z.string().min(10).max(100),
    explanation:z.string().min(10).max(1000),
    tags: z.array(z.string().min(1).max(15)).min(1).max(3)  
})

export const answerSchema = z.object({
    answer:z.string().min(50)
})