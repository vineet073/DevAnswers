import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import React from 'react'

interface PropsType{
    _id:string|number;
    name:string;
    totalQuestions?:number;
    showCount?:boolean
    customClasses?:string;
}

const RenderTags = ({_id,name,totalQuestions,showCount,customClasses}:PropsType) => {
  return (
   
    <Link href={`/tags/${_id}`} className='flex justify-between'>
    <Badge className={`text-light400_light500
    rounded-md px-4 py-2 uppercase ${customClasses}`}>
        {name}
    </Badge>  

    {
        showCount && (
            <p className='small-medium text-dark500_light700'>{totalQuestions}</p>
        )
    }
    </Link>
   
  )
}

export default RenderTags
