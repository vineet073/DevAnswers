import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import RenderTags from '../RenderTags/RenderTags';

const topQuestions = [
  { _id: "1", title: "How do I use express as a custom server in NextJS?" },
  { _id: "2", title: "Can I get the course for free?" },
  { _id: "3", title: "Redux Toolkit Not Updating State as Expected" },
  { _id: "4", title: "Async/Await Function Not Handling Errors Properly" },
  { _id: "5", title: "How do I use express as a custom server in NextJS?" },
];

const popularTags = [
  { _id: "1", name: "javascript", totalQuestions: 15 },
  { _id: "2", name: "react", totalQuestions: 50 },
  { _id: "3", name: "next", totalQuestions: 45 },
  { _id: "4", name: "vue", totalQuestions: 25 },
  { _id: "5", name: "redux", totalQuestions: 5 },
];

const RightSideBar = () => {
  return (
    <div className="background-light900_dark200 custom-scrollbar light-border sticky right-0 top-0 
    flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-28 shadow-light-300 dark:shadow-none
     max-xl:hidden lg:w-[350px]">
      <div>
        <h3 className='h3-bold text-dark200_light900 mb-7'>Top Questions</h3>
        <div className='flex flex-col gap-6'>
          {
            topQuestions.map((item)=>(
              <Link key={item._id} href={`/questions/${item._id}`} className='flex gap-7 justify-between'>
                <p className="body-medium text-dark500_light700">
                  {item.title}
                </p>

                <Image
                src="assets/icons/chevron-right.svg"
                alt="chevron right"
                width={20}
                height={20}
                className="invert-colors"
              />
              </Link>
            ))
          }
        </div>
      </div>

      <div>
        <h2 className="h3-bold text-dark200_light900 mt-16 mb-6">Popular Tags</h2>
        <div className='flex flex-col gap-4'>
          {
            popularTags.map((item)=>(
              <RenderTags _id={item._id} showCount={true} totalQuestions={5} name={`${item.name}`} key={item._id}/>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default RightSideBar
