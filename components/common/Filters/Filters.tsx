import React from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  

interface filterTypes{
    filter:{
        name:string,
        value:string
    }[];
    otherClasses?:string;
    containerClasses?:string
}

const Filters = ({filter,otherClasses,containerClasses}:filterTypes) => {
  return (
    <div className={`${containerClasses}`}>
      <Select>

        <SelectTrigger className={`body-regular light-border background-light800_dark300 
        text-dark500_light700 border px-5 py-2.5 ${otherClasses}`}>
          <SelectValue placeholder="Select a Filter" />
        </SelectTrigger>

        <SelectContent>
            <SelectGroup>
                {filter.map((item)=>(
                    <SelectItem key={item.value} value={item.value} className='text-dark100_light900'>
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
