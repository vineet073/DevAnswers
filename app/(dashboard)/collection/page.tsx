import Filters from '@/components/common/Filters/Filters'
import HomeFilters from '@/components/common/Filters/HomeFilters'
import NoResult from '@/components/common/NoResult/NoResult'
import QuestionCard from '@/components/common/QuestionCard'
import LocalSearchBar from '@/components/common/SearchBars/LocalSearchBar'
import { QuestionFilters } from '@/constants/filterData'
import { fetchSavedQuestions } from '@/lib/controllers/user.actions'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'

const CollectionPage = async() => {

    const {userId}=auth();
    if(!userId){
        redirect('/login');
    }

    const result=await fetchSavedQuestions({clerkId:userId});

  return (
    <div className="flex w-full flex-col gap-9">

      <div className="flex w-full justify-between max-sm:flex-col-reverse">
        <p className="h1-bold text-dark100_light900 max-sm:mt-4">Saved Questions</p>       
      </div>

      <div className="flex gap-4 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />

        <Filters
        filter={QuestionFilters}
        otherClasses='min-h-[56px] sm:min-w-[170px]'
        containerClasses='max-md:flex hidden'
        />
      </div>

      <HomeFilters/>

      <div className="flex flex-col gap-7">
        { result.savedQuestions.length === 0 ? (
          <NoResult
          title="There's no question to show"
          description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
          link="/ask-question"
          linkTitle="Ask a question"
        />
        ):(          
          result.savedQuestions.map((item:any)=>(
            <QuestionCard
            key={item._id}
            _id={item._id}
            title={item.title}
            tags={item.tags}
            author={item.author}
            upvotes={item.upvotes.length}
            views={item.views}
            createdAt={item.createdAt}
            answers={item.answers}/>
          ))          
        )}
      </div>
    
  </div>
  )
}

export default CollectionPage