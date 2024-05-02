import { getQuestionsByUserId } from '@/lib/controllers/question.action'
import React from 'react';
import QuestionCard from '../QuestionCard';

interface QuestionTabProps {
    userId: string;
    clerkId?: string | null;
    searchProps?: { [key: string]: string | undefined };
  }

const QuestionTab = async(params:QuestionTabProps) => {
    const {userId,clerkId}=params;
    const result=await getQuestionsByUserId({userId});
  return (
    <div className='mt-5 flex flex-col gap-4'>
        {
             result.questions.map((item)=>(
                <QuestionCard
                key={item._id}
                _id={item._id}
                title={item.title}
                tags={item.tags}
                author={item.author}
                upvotes={item.upvotes.length}
                views={item.views}
                createdAt={item.createdAt}
                answers={item.answers}
                clerkId={clerkId}/>

              )) 
        }
    </div>
  )
}

export default QuestionTab