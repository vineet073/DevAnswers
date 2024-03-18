'use client'

import { downVoteAnswer, upVoteAnswer } from '@/lib/controllers/answer.actions';
import { viewQuestion } from '@/lib/controllers/interaction.actions';
import { downVoteQuestion, upVoteQuestion } from '@/lib/controllers/question.action';
import { saveQuestion } from '@/lib/controllers/user.actions';
import { formatAndDivideNumber } from '@/lib/utility';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

interface PropsType {
    type: string,
    itemID: string,
    userID: string,
    upVotes: number,
    downVotes: number,
    hasUpVoted: boolean,
    hasDownVoted: boolean,
    hasSaved?: boolean
}

const Vote = ({
    type,
    itemID,
    userID,
    upVotes,
    downVotes,
    hasUpVoted,
    hasDownVoted,
    hasSaved
}:PropsType) => {
    const pathname=usePathname();

    useEffect(()=>{
        viewQuestion({
            userId:userID?JSON.parse(userID):undefined,
            questionId:JSON.parse(itemID)
        })
    },[pathname,userID,itemID])

    const handleVote=async(action:string)=>{
        if(!userID){
            // return;
        }
        if(action==='upvote'){
            if(type==='question'){
                await upVoteQuestion({
                    questionId:JSON.parse(itemID),
                    userId:JSON.parse(userID),
                    hasupVoted:hasUpVoted,
                    hasdownVoted:hasDownVoted,
                    path:pathname
                })
            }else if(type==='answer'){
                await upVoteAnswer({
                    answerId:JSON.parse(itemID),
                    userId:JSON.parse(userID),
                    hasupVoted:hasUpVoted,
                    hasdownVoted:hasDownVoted,
                    path:pathname
                })
            }
        }
        if(action==='downvote'){
            if(type==='question'){
                await downVoteQuestion({
                    questionId:JSON.parse(itemID),
                    userId:JSON.parse(userID),
                    hasupVoted:hasUpVoted,
                    hasdownVoted:hasDownVoted,
                    path:pathname
                })
            }else if(type==='answer'){
                await downVoteAnswer({
                    answerId:JSON.parse(itemID),
                    userId:JSON.parse(userID),
                    hasupVoted:hasUpVoted,
                    hasdownVoted:hasDownVoted,
                    path:pathname
                })
            }
        }

    }

    const handleSave=async(action:string)=>{
        if(!userID){
            // return;
        }
        if(action==='save'){
                await saveQuestion({
                    userId:JSON.parse(userID),
                    questionId:JSON.parse(itemID),
                    path:pathname
                })
        }
    }

  return (
    <div className='flex items-center gap-4'>
        <div className='flex gap-2'>
            <div className='flex items-center gap-1'>
                <Image src={hasUpVoted?'/assets/icons/upvoted.svg':'/assets/icons/upvote.svg'}
                width={18}
                height={18}
                alt='upvote'
                onClick={()=>handleVote('upvote')}/>
                <p className='bg-light-700 p-1 text-sm dark:bg-dark-400'>{formatAndDivideNumber(upVotes)}</p>
            </div>

            <div className='flex items-center gap-1'>
                <Image src={hasDownVoted?'/assets/icons/downvoted.svg':'/assets/icons/downvote.svg'}
                width={18}
                height={18}
                alt='upvote'
                onClick={()=>handleVote('downvote')}/>
                    <p className='bg-light-700 p-1 text-sm dark:bg-dark-400'>{formatAndDivideNumber(downVotes)}</p>
            </div>
        </div>

        <div>
            {
                type==='question' && (
                    <Image
                    src={hasSaved ? '/assets/icons/star-filled.svg'
                    : '/assets/icons/star-red.svg'}
                    alt='saved'
                    width={18}
                    height={18}
                    onClick={()=>handleSave('save')}/>
                )
            }
        </div>
    </div>
  )
}

export default Vote