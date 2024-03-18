'use client'

import { deleteAnswer } from '@/lib/controllers/answer.actions';
import { deleteQuestion } from '@/lib/controllers/question.action';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import React from 'react'

interface PropsType {
  type:string;
  itemId:string;
}
const ActionButtons = ({type,itemId}:PropsType) => {
    const path=usePathname();
    const router=useRouter();
    const handleEdit=()=>{
        router.push(`/questions/edit/${itemId}`);
    }

    const handleDelete=async()=>{
        if(type==='question'){
            await deleteQuestion({questionId:itemId,path})
        }else if(type==='answer'){
            await deleteAnswer({answerId:itemId,path})
        }
    }

  return (
    <div className='flex gap-2'>
        {type === 'question' && (
        <Image
          src="/assets/icons/edit.svg"
          alt="Edit"
          width={14}
          height={14}
          className="cursor-pointer object-contain"
          onClick={handleEdit}
        />
      )}
      <Image
        src="/assets/icons/trash.svg"
        alt="Delele"
        width={14}
        height={14}
        className="cursor-pointer object-contain"
        onClick={handleDelete}
      />
    </div>
  )
}

export default ActionButtons