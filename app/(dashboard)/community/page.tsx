import LocalSearchBar from '@/components/common/SearchBars/LocalSearchBar'
import React from 'react'
import { UserFilters } from '@/constants/filterData'
import Filters from '@/components/common/Filters/Filters'
import { getAllUser } from '@/lib/controllers/user.actions'
import UserCard from '@/components/common/UserCard'
import Link from 'next/link'

const page = async() => {

    const result=await getAllUser({});

  return (
    <div>
        
        <p className="h1-bold text-dark100_light900 max-sm:mt-4 mb-9">All Users</p>       

        <div className="flex gap-4 max-sm:flex-col sm:items-center">
            <LocalSearchBar
                route="/"
                iconPosition="left"
                imgSrc="/assets/icons/search.svg"
                placeholder="Search for questions"
                otherClasses="flex-1"
            />

            <Filters
                filter={UserFilters}
                otherClasses='min-h-[56px] sm:min-w-[170px]'
            />
        </div>

        <div className='mt-9 flex flex-wrap items-center gap-4 mx-auto'>
            {
                result.users.length>0 ? (
                    result.users.map((item)=>(
                        <UserCard key={item._id} user={item}/>
                    ))
                ):(
                    <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
                        <p>No User yet</p>
                        <Link href="/sign-up" className="mt-2 font-bold text-accent-blue">
                        Join to be the first!
                        </Link>
                    </div>
                )
            }
        </div>

    </div>
  )
}

export default page
