'use client'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery } from '@/lib/utility';
  

interface filterTypes{
    filter:{
        name:string,
        value:string
    }[];
    otherClasses?:string;
    containerClasses?:string
}

const Filters = ({filter,otherClasses,containerClasses}:filterTypes) => {
  const router=useRouter();
  const searchParams=useSearchParams();
  const filterValue=searchParams.get('filter');

  const handleClick=(value:string)=>{

      const newUrl=formUrlQuery({
        params:searchParams.toString(),
        key:'filter',
        value
      });
      router.push(newUrl,{scroll:false});
  }
      
  return (
    <div className={`${containerClasses}`}>
      <Select onValueChange={(value)=>handleClick(value)} defaultValue={filterValue || undefined}>

        <SelectTrigger className={`body-regular light-border background-light800_dark300
        text-dark500_light700 border px-5 py-2.5 ${otherClasses}`} >
          <SelectValue placeholder="Select a Filter"/>
        </SelectTrigger>

        <SelectContent className="text-dark500_light700 small-regular border-none bg-light-900 focus:outline-none active:outline-none dark:bg-dark-300">
            <SelectGroup >
                {filter.map((item)=>(
                    <SelectItem key={item.value} value={item.value} className='text-dark100_light900
                    cursor-pointer focus:bg-light-800 dark:focus:bg-dark-400'>
                        {item.name}
                    </SelectItem>
                ))}
            </SelectGroup>
        </SelectContent>

       </Select>

    </div>
  )
}

export default Filters
