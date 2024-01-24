import Metric from '@/components/common/Metric';
import ParseHTML from '@/components/common/ParseHTML/ParseHTML';
import { getQuestionsById } from '@/lib/controllers/question.action'
import { formatAndDivideNumber, getTimestamp } from '@/lib/utility';
import Image from 'next/image'
import React from 'react'

const page = async({params}:any) => {

    const questionId=params.question_id;
    const result=await getQuestionsById({questionId:questionId});

  return (
    <div>
      <div className='flex justify-between max-sm:flex-col-reverse'>
        <div className='flex gap-1 items-center'>
            <Image
            src={result.author.picture}
            alt='profile-pic'
            width={20}
            height={20}
            className='rounded-full'
            />

            <p className="paragraph-semibold text-dark300_light700">{result.author.name}</p>
        </div>

        <div className='flex justify-end max-sm:w-full'>
            <div className='text-dark300_light700'>
                votes
            </div>
        </div>
      </div>

      <div className='flex gap-4'>
            <Metric
            imgUrl="/assets/icons/clock.svg"
            alt="User"
            title={`asked ${getTimestamp(result.createdAt)}`}
            href={`/profile/${result.author._id}`}
            isAuthor
            textStyles="body-medium text-dark400_light700"
            />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="message"
            value={formatAndDivideNumber(result.answers.length)}
            title=" Answers"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="eye"
            value={formatAndDivideNumber(result.views)}
            title=" Views"
            textStyles="small-medium text-dark400_light800"
          />
      </div>

      <ParseHTML data={result.content}/>
    </div>
  )
}

export default page
