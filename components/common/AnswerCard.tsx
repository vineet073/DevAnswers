import { formatAndDivideNumber, getTimestamp } from '@/lib/utility';
import React from 'react';
import Metric from './Metric';
import Link from 'next/link';
import { SignedIn } from '@clerk/nextjs';
import ActionButtons from './ActionButtons';
import { IQuestion } from '@/models/question.model';

interface propsType{
    _id:string;
    content:string;
    author:{_id:string;name:string;picture:string,clerkId:string};
    upvotes:number;
    createdAt:Date;
    question:IQuestion,
    clerkId?:string|null;
}

const AnswerCard = ({
    _id,
    content,
    author,
    upvotes,
    createdAt,
    question,
    clerkId
  }: propsType) => {
    const showActionButtons=clerkId && clerkId===author.clerkId;
  return (
    <div className='background-light900_dark200 flex flex-col rounded-lg p-7 shadow-sm'>
        <p className='text-dark400_light700 mb-1 hidden text-xs max-sm:flex'>{getTimestamp(createdAt)}</p>

        <div className='flex justify-between'>
            <Link href={`/questions/${question._id}/#${_id}`}>
                <p className='text-dark100_light900 h3-bold line-clamp-1'>
                    {question?.title}
                </p>
            </Link>
            <SignedIn>
            {showActionButtons && (
                <ActionButtons type='answer' itemId={_id}/>
            )}
            </SignedIn>
        </div>
        

        <div className='flex justify-between gap-2 pt-4 max-md:flex-col'>
            <Metric
            imgUrl={author.picture}
            alt="User"
            value={author.name}
            title={` - answered ${getTimestamp(createdAt)}`}
            href={`/profile/${author._id}`}
            isAuthor
            textStyles="body-medium text-dark400_light700"
            />

            <div className='flex gap-4'>
            <Metric
                imgUrl="/assets/icons/like.svg"
                alt="Upvotes"
                value={formatAndDivideNumber(upvotes)}
                title=" Votes"
                textStyles="small-medium text-dark400_light800"
            />
            </div>
        
        </div>
            

    
    </div>
  )
}

export default AnswerCard
