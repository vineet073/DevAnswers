import React from 'react';
import { getAnswersByUserId } from '@/lib/controllers/answer.actions';
import AnswerCard from '../AnswerCard';

interface AnswerTabProps {
    userId: string;
    clerkId?: string | null;
    searchProps?: { [key: string]: string | undefined };
  }

const AnswerTab = async(params:AnswerTabProps) => {
    const {userId,clerkId}=params;
    const result=await getAnswersByUserId({userId});
  return (
    <div>
        {
             result.answers.map((item)=>(
                <AnswerCard
                key={item._id}
                _id={item._id}
                content={item.content}
                author={item.author}
                upvotes={item.upvotes.length}
                createdAt={item.createdAt}
                question={item.question}
                clerkId={clerkId}
                />
              )) 
        }
    </div>
  )
}

export default AnswerTab