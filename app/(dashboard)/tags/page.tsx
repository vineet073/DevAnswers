import Filters from '@/components/common/Filters/Filters'
import Pagination from '@/components/common/Pagination/Pagination'
import LocalSearchBar from '@/components/common/SearchBars/LocalSearchBar'
import { TagFilters } from '@/constants/filterData'
import { getAllTags } from '@/lib/controllers/tag.actions'
import { SearchParamsProps } from '@/types/types'
import Link from 'next/link'
import React from 'react'

const page = async({searchParams}:SearchParamsProps) => {

    const searchQuery=searchParams.q;
    const filter=searchParams.filter;
    const page = searchParams?.page ? +searchParams.page : 1;
    const result=await getAllTags({searchQuery,filter,page});

  return (
    <div>
        
        <p className="h1-bold text-dark100_light900 mb-9 max-sm:mt-4">All Tags</p>       

        <div className="flex gap-4 max-sm:flex-col sm:items-center">
            <LocalSearchBar
                route="/tags"
                iconPosition="left"
                imgSrc="/assets/icons/search.svg"
                placeholder="Search for questions"
                otherClasses="flex-1"
            />

            <Filters
                filter={TagFilters}
                otherClasses='min-h-[56px] sm:min-w-[170px]'
            />
        </div>

        <div className='mx-auto mt-9 flex flex-wrap items-center gap-4'>
            {
                (result?.tags.length ?? 0) > 0 ? (
                    result?.tags.map((item)=>(
                       <div key={item._id}>
                         <Link href={`/tags/${item._id}`}>
                            <div className='background-light900_dark200 flex w-[220px] flex-col items-center justify-center rounded-md p-7 shadow-sm dark:shadow-none'>
                                
                                <p className="paragraph-semibold text-dark300_light900 background-light800_dark400 mb-3 rounded-sm px-4 py-1">
                                    {item.name}
                                </p>
                                <p>{item?.description}</p>
                                <p className='text-dark400_light500 text-xs'><span className='text-sm text-primary-500'>{item.questions.length}+</span> Questions</p>
                            </div>
                        </Link>
                       </div>
                    ))
                ):(
                    <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
                        <p>No Tags yet</p>
                        <Link href="/ask-question" className="mt-2 font-bold text-accent-blue">
                        Ask a Question
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
