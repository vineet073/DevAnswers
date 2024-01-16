import * as z from 'zod';

export const questionSchema = z.object({
    title:z.string().min(10).max(100),
    explanation:z.string().min(10).max(500),
    tags: z.array(z.string().min(1).max(15)).min(1).max(3)  
})