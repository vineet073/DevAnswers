'use client'

import { Input } from '@/components/ui/input';
import { formUrlQuery, removeUrlQuery } from '@/lib/utility';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

interface CustomInputProps{
    route:string;
    iconPosition:string;
    imgSrc:string;
    placeholder?:string;
    otherClasses?:string
}

const LocalSearchBar = ({
    route,
    iconPosition,
    imgSrc,
    placeholder,
    otherClasses,
  }: CustomInputProps) => {
    const router=useRouter();
    const pathname=usePathname();
    const searchParams=useSearchParams();  

    const query=searchParams.get('q');
    const [search,setSearch]=useState(query || '');

    useEffect(()=>{
      const debounceFn=setTimeout(()=>{
        if(search){
          const newUrl=formUrlQuery({
            params:searchParams.toString(),
            key:'q',
            value:search
          });
          router.push(newUrl,{scroll:false});
        }else{
          const newUrl=removeUrlQuery({
            params:searchParams.toString(),
            keys:['q']          
          })
          router.push(newUrl,{scroll:false});
        }
      },300);
      return ()=>clearTimeout(debounceFn);
    },[router,pathname,searchParams,route,query,search]);


  return (
    <div className={`text-dark100_light900 background-light800_darkgradient flex min-h-[56px] 
    items-center gap-7 rounded-[10px] ${otherClasses} px-4`}>
      {
        iconPosition==='left' && (
            <Image
          src={imgSrc}
          alt="Search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
        )
      }

      <Input
      type='text'
      placeholder={placeholder}
      value={search}
      className="paragraph-regular no-focus placeholder  
        background-light800_darkgradient
        border-none shadow-none outline-none"
      onChange={(e:any)=>setSearch(e.target.value)}
      />

    {
        iconPosition==='right' && (
            <Image
            src={imgSrc}
            alt="Search icon"
            width={24}
            height={24}
            className="cursor-pointer"
        />
        )
    }
    </div>

      
  )
}

export default LocalSearchBar
