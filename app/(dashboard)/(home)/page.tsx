import Filters from "@/components/common/Filters/Filters";
import HomeFilters from "@/components/common/Filters/HomeFilters";
import NoResult from "@/components/common/NoResult/NoResult";
import QuestionCard from "@/components/common/QuestionCard";
import LocalSearchBar from "@/components/common/SearchBars/LocalSearchBar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filterData";
import Link from "next/link";

const questions = [
  {
    _id: "1",
    title: "Cascading Deletes in SQLAlchemy?",
    tags: [
      { _id: "1", name: "python" },
      { _id: "2", name: "sql" },
    ],
    author: { _id: "1", name: "John Doe", picture: "john.jpg" },
    upvotes: 101506,
    views: 1000007,
    answers: [],
    createdAt: new Date("2022-12-01T12:00:00.000Z"),
  },
  {
    _id: "2",
    title: "How to center a div?",
    tags: [
      { _id: "3", name: "html" },
      { _id: "4", name: "css" },
    ],
    author: { _id: "2", name: "Jane Smith", picture: "jane.jpg" },
    upvotes: 35001,
    views: 150000002,
    answers: [],
    createdAt: new Date("2023-09-02T10:30:00.000Z"),
  },
];

export default function Home() {
  return (
    <div className="flex w-full flex-col gap-9">
      <div className="flex w-full justify-between max-sm:flex-col-reverse">
        
          <p className="h1-bold text-dark100_light900 max-sm:mt-4">All Questions</p>       

        
          <Link href={'/ask-question'} className="flex justify-end max-sm:w-full">
            <Button className="primary-gradient min-h-[46px] text-base text-light-900">
              Ask Question
            </Button>
          </Link>
        
      </div>

      <div className="flex max-sm:flex-col sm:items-center gap-4">
        <LocalSearchBar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />

        <Filters
        filter={HomePageFilters}
        otherClasses='min-h-[56px] sm:min-w-[170px]'
        containerClasses='max-md:flex hidden'
        />
      </div>

      <HomeFilters/>

      <div className="flex flex-col gap-7">
        { questions.length === 0 ? (
           <NoResult
           title="There's no question to show"
           description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
           link="/ask-question"
           linkTitle="Ask a question"
         />
        ):(          
          questions.map((item)=>(
            <QuestionCard
            key={item._id}
            _id={item._id}
            title={item.title}
            tags={item.tags}
            author={item.author}
            upvotes={item.upvotes}
            views={item.views}
            createdAt={item.createdAt}
            answers={item.answers}/>
          ))          
        )}
      </div>

      
    </div>
  )
}
