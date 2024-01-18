import AskQuestionForm from '@/components/core/AskQuestionForm/AskQuestionForm'
import { getUserByClerkId } from '@/lib/controllers/user.actions';
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation';
import React from 'react'

const AskQuestion = async () => {

  const {userId}=auth();

  if(!userId){
    redirect('/sign-in');
  }

  const mongoUser=await getUserByClerkId(userId);

  return (
    <div className='p-4'>
      <h2 className='h2-bold text-dark100_light900'>Ask a public question</h2>
      <AskQuestionForm mongoUserId={JSON.stringify(mongoUser?._id)}/>
    </div>
  )
}

export default AskQuestion
