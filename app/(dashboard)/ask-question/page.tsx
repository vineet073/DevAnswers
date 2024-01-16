import AskQuestionForm from '@/components/core/AskQuestionForm/AskQuestionForm'
import React from 'react'

const AskQuestion = () => {
  return (
    <div className='p-4'>
      <h2 className='h2-bold text-dark100_light900'>Ask a public question</h2>
      <AskQuestionForm/>
    </div>
  )
}

export default AskQuestion
