/* eslint-disable tailwindcss/no-custom-classname */
'use client'


import { Input } from '@/components/ui/input';
import { formUrlQuery, removeUrlQuery } from '@/lib/utility';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import GlobalResult from './GlobalResult';

const GlobalSearchBar = () => {
    const router=useRouter();
    const pathname=usePathname();
    const searchParams=useSearchParams();
  
    const query=searchParams.get('global');
    const [search,setSearch]=useState(query || '');
    const [isModalOpen,setIsModalOpen]=useState(false);
    const searchContainerRef=useRef(null);

    useEffect(()=>{
      const handleOutsideClick=(e:any)=>{
        if (
          searchContainerRef.current &&
          // @ts-ignore
          !searchContainerRef.current.contains(e.target)
        ) {
          setIsModalOpen(false);
          setSearch('');
        }
      }

      setIsModalOpen(false);
      document.addEventListener('click',handleOutsideClick);
      return ()=>document.removeEventListener('click',handleOutsideClick);
    },[pathname]);

    useEffect(()=>{
      const debounceFn=setTimeout(()=>{
        if(search){
          const newUrl=formUrlQuery({
            params:searchParams.toString(),
            key:'global',
            value:search
          });
          router.push(newUrl,{scroll:false});
        }else{
            if(query){
                const newUrl=removeUrlQuery({
                    params:searchParams.toString(),
                    keys:['global','type']          
                })
                router.push(newUrl,{scroll:false});
            }

        }
      },300);
      return ()=>clearTimeout(debounceFn);
    },[router,pathname,searchParams,query,search]);


  return (
    <div className='relative w-full max-w-[600px] max-lg:hidden' ref={searchContainerRef}>
        <div className={`text-dark100_light900 background-light800_darkgradient flex min-h-[50px] 
        items-center gap-7 rounded-[10px] px-4`}>

            <Image
                src="/assets/icons/search.svg"
                alt="Search icon"
                width={24}
                height={24}
                className="cursor-pointer"
            />

            <Input
            type='text'
            placeholder={'Search anything globally...'}
            value={search}
            className="paragraph-regular no-focus placeholder  
            background-light800_darkgradient
            text-dark400_light700 text-md border-none shadow-none outline-none"
            onChange={(e:any)=>{
              setSearch(e.target.value);
              if(!isModalOpen){
                setIsModalOpen(true);
              }
              if(e.target.value==='' && isModalOpen){
                setIsModalOpen(false);
              }              
            }}/>

        </div>

        {
          isModalOpen && (
            <GlobalResult/>
          )
        }
    </div>
   

      
  )
}

export default GlobalSearchBar
