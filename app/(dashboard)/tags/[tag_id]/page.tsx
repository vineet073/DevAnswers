import NoResult from '@/components/common/NoResult/NoResult';
import Pagination from '@/components/common/Pagination/Pagination';
import QuestionCard from '@/components/common/QuestionCard';
import LocalSearchBar from '@/components/common/SearchBars/LocalSearchBar';
import { getQuestionsByTagId } from '@/lib/controllers/tag.actions';
import {  URLProps } from '@/types/types'
import React from 'react'

const page = async({params,searchParams}:URLProps) => {
    const tagId=params.tag_id;
    const searchQuery=searchParams.q;
    const page=searchParams?.page ? +searchParams.page : 1;
    const result=await getQuestionsByTagId({tagId,searchQuery,page});
  return (
    <div className="flex w-full flex-col gap-9">
      <div className="flex w-full justify-between max-sm:flex-col-reverse">
        
          <p className="h1-bold text-dark100_light900 max-sm:mt-4">{result.tagTitle}</p>       
        
      </div>

      <div className="flex gap-4 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route={`/tags/${tagId}`}
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
      </div>


      <div className="flex flex-col gap-7">
        { result.questions.length === 0 ? (
          <NoResult
          title="There's no question related to this tag."
          description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
          link="/ask-question"
          linkTitle="Ask a question"
        />
        ):(          
          result.questions.map((item:any)=>(
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

      <div>
        <Pagination isNext={result.isNext} pageNumber={page}/>
      </div>
    
    </div>
  )
}

export default page