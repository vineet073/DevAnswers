
import LocalSearchBar from '@/components/common/SearchBars/LocalSearchBar'
import React from 'react'
import { UserFilters } from '@/constants/filterData'
import Filters from '@/components/common/Filters/Filters'
import { getAllUser } from '@/lib/controllers/user.actions'
import UserCard from '@/components/common/UserCard'
import Link from 'next/link'
import { SearchParamsProps } from '@/types/types'
import Pagination from '@/components/common/Pagination/Pagination'

const page = async({searchParams}:SearchParamsProps) => {
    const searchQuery=searchParams.q;
    const filter=searchParams.filter;
    const page = searchParams?.page ? +searchParams.page : 1;

    const result=await getAllUser({searchQuery,filter,page});

  return (
    <div>
        
        <p className="h1-bold text-dark100_light900 mb-9 max-sm:mt-4">All Users</p>       

        <div className="flex gap-4 max-sm:flex-col sm:items-center">
            <LocalSearchBar
                route="/community"
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

        <div className='mx-auto mt-9 flex flex-wrap items-center gap-4'>
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

        <div className='mt-10'>
            <Pagination pageNumber={page} isNext={result.isNext}/>
        </div>

    </div>
  )
}

export default page
