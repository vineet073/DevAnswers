'use client'

import { Input } from '@/components/ui/input';
import Image from 'next/image';
import React from 'react'

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
      className="paragraph-regular no-focus placeholder  
        background-light800_darkgradient
        border-none shadow-none outline-none"
      onChange={()=>{}}
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
