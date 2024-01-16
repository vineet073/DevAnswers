'use client'

import { Button } from '@/components/ui/button'
import { HomePageFilters } from '@/constants/filterData'
import React from 'react'

const HomeFilters = () => {
    const active="newest"
  return (
    <div className='max-md:hidden flex gap-4'>
      {
        HomePageFilters.map((item)=>(
            <Button
            key={item.value}
            onClick={()=>{}}
            className={`${active=== item.value? "bg-primary-100 text-primary-500":
            "bg-light-800 text-light-500"}`}>
                {item.name}
            </Button>
        ))
      }
    </div>
  )
}

export default HomeFilters
