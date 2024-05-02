'use client'

import { Button } from '@/components/ui/button'
import { HomePageFilters } from '@/constants/filterData'
import { formUrlQuery, removeUrlQuery } from '@/lib/utility'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'

const HomeFilters = () => {
  const router=useRouter();
  const searchParams=useSearchParams();
  const filter=searchParams.get('filter');
  const [active,setActive]=useState(filter||'');

  const handleClick=(item:string)=>{
    if(item===active){
      setActive('');
      const newUrl=removeUrlQuery({
        params:searchParams.toString(),
        keys:['filter']
      });
      router.push(newUrl,{scroll:false});
    }else{
      setActive(item);
      const newUrl=formUrlQuery({
        params:searchParams.toString(),
        key:'filter',
        value:item.toLowerCase()
      });
      router.push(newUrl,{scroll:false});
    }
  }
      

  return (
    <div className='flex gap-4 max-md:hidden'>
      {
        HomePageFilters.map((item)=>(
            <Button
            key={item.value}
            onClick={()=>{}}
            className={`${active=== item.value? "bg-primary-100 text-primary-500":
            "bg-light-800 text-light-500"}`}
            onClickCapture={()=>handleClick(item.value)}>
                {item.name}
            </Button>
        ))
      }
    </div>
  )
}

export default HomeFilters
