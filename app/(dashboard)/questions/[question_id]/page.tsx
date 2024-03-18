import AnswerModal from '@/components/common/AnswerModal';
import Filters from '@/components/common/Filters/Filters';
import Metric from '@/components/common/Metric';
import ParseHTML from '@/components/common/ParseHTML/ParseHTML';
import RenderTags from '@/components/common/RenderTags/RenderTags';
import Vote from '@/components/common/Votes/Vote';
import AnswerForm from '@/components/core/AnswerForm/AnswerForm';
import { AnswerFilters } from '@/constants/filterData';
import { getAnswerByQId } from '@/lib/controllers/answer.actions';
import { getQuestionsById } from '@/lib/controllers/question.action'
import { getUserByClerkId } from '@/lib/controllers/user.actions';
import { formatAndDivideNumber, getTimestamp } from '@/lib/utility';
import { auth } from '@clerk/nextjs';
import Image from 'next/image'
import React from 'react'

const page = async({params}:any) => {

    const questionId=params.question_id;
    const {question}=await getQuestionsById({questionId});
    const answers=await getAnswerByQId({questionId});

    const {userId}=auth();

      const user=await getUserByClerkId(userId);


  return (
    <div className=''>
      <div className='flex justify-between max-sm:flex-col-reverse'>
        <div className='flex items-center gap-1'>
            <Image
            src={question?.author?.picture}
            alt='profile-pic'
            width={20}
            height={20}
            className='rounded-full'
            />

            <p className="paragraph-semibold text-dark300_light700">{question?.author.name}</p>
        </div>

        <div className='flex justify-end max-sm:w-full'>
            <div className='text-dark300_light700'>
                <Vote
                type='question'
                itemID={JSON.stringify(questionId)}
                userID={JSON.stringify(user._id)}
                upVotes={question?.upvotes.length}
                downVotes={question?.downvotes.length}
                hasUpVoted={question?.upvotes.includes(user._id)}
                hasDownVoted={question?.downvotes.includes(user._id)}
                hasSaved={user.saved.includes(questionId)}
                />

            </div>
        </div>
      </div>

      <div className='text-dark200_light900 my-3 text-2xl font-semibold'>{question.title}</div>

      <div className='mb-5 flex gap-4'>
            <Metric
            imgUrl="/assets/icons/clock.svg"
            alt="User"
            title={`asked ${getTimestamp(question.createdAt)}`}
            href={`/profile/${question.author._id}`}
            isAuthor
            textStyles="body-medium text-dark400_light700"
            />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="message"
            value={formatAndDivideNumber(question.answers.length)}
            title=" Answers"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="eye"
            value={formatAndDivideNumber(question.views)}
            title=" Views"
            textStyles="small-medium text-dark400_light800"
          />
      </div>

      <ParseHTML data={question.content}/>

      <div className='mt-4 flex gap-2'>
        {
          question.tags.map((tag:any)=>{
            return <RenderTags key={tag._id} _id={tag._id} name={tag.name} customClasses='font-normal text-xs background-light800_dark300'/>
          })
        }
      </div>

      <div>
        <div className='mb-8 mt-20 flex justify-between'>
          <p className='text-xl font-medium text-primary-500'>{answers.length} Answers</p>
          <Filters filter={AnswerFilters}/>
        </div>

        <div className='mb-20'>
          {
            answers.length !==0 && (
              answers.map((answer:any)=>(
                <AnswerModal key={answer._id} answer={answer} userID={JSON.stringify(user._id)}/>
              ))
            )
          }
        </div>
        
      </div>

      <AnswerForm questionID={JSON.stringify(questionId)} question={question.content} authorID={JSON.stringify(question.author._id)}/>
    </div>
  )
}

export default page
