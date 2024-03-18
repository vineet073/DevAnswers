import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import RenderTags from '../RenderTags/RenderTags';
import { getHotQuestions } from '@/lib/controllers/question.action';
import { getTopTags } from '@/lib/controllers/tag.actions';


const RightSideBar = async() => {
  const topQuestions=await getHotQuestions();
  const popularTags=await getTopTags();

  return (
    <div className="background-light900_dark200 custom-scrollbar light-border sticky right-0 top-0 
    flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-28 shadow-light-300 dark:shadow-none
     max-xl:hidden lg:w-[350px]">
      <div>
        <h3 className='h3-bold text-dark200_light900 mb-7'>Top Questions</h3>
        <div className='flex flex-col gap-6'>
          {
            topQuestions.map((item)=>(
              <Link key={item._id} href={`/questions/${item._id}`} className='flex justify-between gap-7'>
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
        <h2 className="h3-bold text-dark200_light900 mb-6 mt-16">Popular Tags</h2>
        <div className='flex flex-col gap-4'>
          {
            popularTags.map((item)=>(
              <RenderTags _id={item._id} showCount={true} totalQuestions={item.questionCount} name={`${item.name}`} key={item._id}/>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default RightSideBar
