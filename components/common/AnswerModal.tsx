import { IAnswer } from '@/models/answer.model'
import React from 'react'
import ParseHTML from './ParseHTML/ParseHTML'
import Image from 'next/image'
import { IUser } from '@/models/user.model'
import { getTimestamp } from '@/lib/utility'
import Link from 'next/link';
import { GoDotFill } from "react-icons/go";
import Vote from './Votes/Vote'

interface propsType{
    key:string,
    answer:IAnswer,
    userID:string
}

const AnswerModal = ({key,answer,userID}:propsType) => {
  return (
    <div className='mb-5'>
      <div className='mb-4 flex justify-between max-sm:flex-col-reverse'>
        <Link className='flex gap-3' href={`/profile/${(answer.author as IUser).clerkId}`}>
          <div className='flex gap-1'>
            <Image src={(answer.author as IUser).picture} alt='profilePic'
            width={24} height={24} className='rounded-full'/>
            <p className='text-dark300_light900 font-semibold'>{(answer.author as IUser).name}</p>
          </div>
          
          <div className='text-light400_light500 flex items-center'>
            <GoDotFill className='fill-light-400 dark:fill-light-500' size={10}/>
            <p className='text-sm'>answererd {getTimestamp(answer.createdAt)}</p>
          </div>
        </Link>

        <div className='flex justify-end text-white max-sm:w-full'>
          {
            (answer.author as IUser)._id.toString() !== JSON.parse(userID).toString() && (
              <Vote
                type='answer'
                itemID={JSON.stringify(answer._id)}
                userID={userID}
                upVotes={answer.upvotes.length}
                downVotes={answer.downvotes.length}
                hasUpVoted={answer.upvotes.includes(JSON.parse(userID))}
                hasDownVoted={answer.downvotes.includes(JSON.parse(userID))}
              />
            )
          }
              
        </div>
      </div>
      <ParseHTML data={answer.content}/>
    </div>
  )
}

export default AnswerModal