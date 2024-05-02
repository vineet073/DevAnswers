'use client'

import { Button } from '@/components/ui/button';
import { formUrlQuery } from '@/lib/utility';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react'

interface Props{
    pageNumber:number;
    isNext:boolean;
}

const Pagination = ({pageNumber,isNext}:Props) => {
    const searchParams=useSearchParams();
    const router=useRouter();
    const handleNavigation=(direction:string)=>{
        const nextPage=direction==='prev'?pageNumber-1:pageNumber+1;
        const newUrl=formUrlQuery({
            params:searchParams.toString(),
            key:'page',
            value:nextPage.toString()
        })

        router.push(newUrl,{scroll:false})
    }
  return (
    <div className='flex items-center justify-center gap-2'>
        <Button disabled={pageNumber===1}
        onClick={()=>handleNavigation('prev')}
        className='background-light800_dark300 btn light-border-2 px-3'>
            <p className='text-dark200_light800'>Prev</p>
        </Button>

        <div className='bg-primary-500 px-3.5 py-3 rounded-md w-fit text-white font-semibold'>{pageNumber}</div>

        <Button disabled={!isNext}
        onClick={()=>handleNavigation('next')}
        className='background-light800_dark300 btn light-border-2 px-3'>
            <p className='text-dark200_light800'>Next</p>
        </Button>

    </div>
  )
}

export default Pagination