import { formatAndDivideNumber, getTimestamp } from '@/lib/utility';
import React from 'react';
import RenderTags from './RenderTags/RenderTags';
import Metric from './Metric';
import Link from 'next/link';
import { SignedIn, auth } from '@clerk/nextjs';
import ActionButtons from './ActionButtons';

interface propsType{
    _id:string;
    title:string;
    tags:{_id:string;name:string}[];
    author:{_id:string;name:string;picture:string,clerkId:string};
    upvotes:number;
    views:number;
    answers:Array<object>;
    createdAt:Date;
    clerkId?:string|null;
}

const QuestionCard = ({
    _id,
    title,
    tags,
    author,
    upvotes,
    views,
    answers,
    createdAt,
    clerkId
  }: propsType) => {
    const {userId:currentClerkId}=auth();
    const showActionButtons=clerkId && clerkId===author.clerkId;
  return (
    <div className='background-light900_dark200 flex flex-col rounded-lg p-7 shadow-sm'>
      <p className='text-dark400_light700 mb-1 hidden text-xs max-sm:flex'>{getTimestamp(createdAt)}</p>
      <div className='flex justify-between'>
        <Link href={`/questions/${_id}`}>
          <h1 className='text-dark100_light900 h3-bold line-clamp-1'>{title}</h1>
        </Link>

        <SignedIn>
          {showActionButtons && (currentClerkId===clerkId)&& (
            <ActionButtons type='question' itemId={_id}/>
          )}
        </SignedIn>
      </div>
      
      <div className='mb-4 mt-3 flex gap-2'>
      {
            tags.map((item)=>(
                <RenderTags
                key={item._id}
                _id={item._id}
                name={item.name}
            
                />
            ))
        }
      </div>

      <div className='flex justify-between gap-2 max-md:flex-col'>
        <Metric
          imgUrl={author?.picture}
          alt="User"
          value={author?.name}
          title={` - asked ${getTimestamp(createdAt)}`}
          href={`/profile/${author?._id}`}
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
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="message"
            value={formatAndDivideNumber(answers.length)}
            title=" Answers"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="eye"
            value={formatAndDivideNumber(views)}
            title=" Views"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
       
      </div>
        

    
    </div>
  )
}

export default QuestionCard
