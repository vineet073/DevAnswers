import { Button } from '@/components/ui/button';
import { GlobalSearchFilters } from '@/constants/filterData';
import { formUrlQuery, removeUrlQuery } from '@/lib/utility';
import { useRouter, useSearchParams } from 'next/navigation';

import React, { useState } from 'react'

const GlobalFilters = () => {
    const router=useRouter();
    const searchParams=useSearchParams();
    const type=searchParams.get('type');
    const [active,setActive]=useState(type||'');

    const handleClick=(item:string)=>{
        if(item===active){
          setActive('');
          const newUrl=removeUrlQuery({
            params:searchParams.toString(),
            keys:['type']
          });
          router.push(newUrl);
        }else{
          setActive(item);
          const newUrl=formUrlQuery({
            params:searchParams.toString(),
            key:'type',
            value:item.toLowerCase()
          });
          router.push(newUrl);
        }
      }
  return (
    <div className='flex items-baseline gap-3 px-5'>
        <p className="text-dark400_light900 body-medium">Type:</p>
        <div className='flex gap-3'>
            {GlobalSearchFilters.map((item)=>(
                <Button key={item.value} onClick={()=>handleClick(item.value)}
                className={`rounded-full px-5 text-sm dark:text-light-800  ${
                    active === item.value
                      ? 'bg-primary-500 text-light-900 '
                      : 'bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500 dark:hover:text-primary-500'
                }`}>
                    {item.name}
                </Button>
            ))}
        </div>
    </div>
  )
}

export default GlobalFilters