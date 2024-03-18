
import AskQuestionForm from '@/components/core/AskQuestionForm/AskQuestionForm'
import { getQuestionsById } from '@/lib/controllers/question.action';
import { getUserByClerkId } from '@/lib/controllers/user.actions';
import { ParamsProps} from '@/types/types'
import { auth} from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react'

const Editpage = async({params}:ParamsProps) => {
  const questionId=params.id;
  const {userId}=auth();

  if(!userId){
    redirect('/sign-in');
  }
  const {question}=await getQuestionsById({questionId});
  
  const mongoUser=await getUserByClerkId(userId);
  return (
  <div className='p-4'>
    <h2 className='h2-bold text-dark100_light900'>Ask a public question</h2>
    <AskQuestionForm type='Edit' mongoUserId={JSON.stringify(mongoUser?._id)} questionData={JSON.stringify(question)}/> 
     </div>
  )
}

export default Editpage