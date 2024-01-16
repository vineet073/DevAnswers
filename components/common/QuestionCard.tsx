import { formatAndDivideNumber, getTimestamp } from '@/lib/utility';
import React from 'react';
import RenderTags from './RenderTags/RenderTags';
import Metric from './Metric';

interface propsType{
    _id:string;
    title:string;
    tags:{_id:string;name:string}[];
    author:{_id:string;name:string;picture:string};
    upvotes:number;
    views:number;
    answers:Array<object>;
    createdAt:Date;
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
  }: propsType) => {
  return (
    <div className='flex flex-col background-light900_dark200 p-7 rounded-lg shadow-sm'>
      <p className='max-sm:flex hidden text-dark400_light700 text-xs mb-1'>{getTimestamp(createdAt)}</p>
      <h1 className='line-clamp-1 text-dark100_light900 h3-bold'>{title}</h1>
      <div className='flex gap-2 mt-3 mb-4'>
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

      <div className='max-md:flex-col flex justify-between gap-2'>
        <Metric
          imgUrl="/assets/icons/avatar.svg"
          alt="User"
          value={author.name}
          title={` - asked ${getTimestamp(createdAt)}`}
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
