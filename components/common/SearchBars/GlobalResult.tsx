import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import GlobalFilters from './GlobalFilters';
import Link from 'next/link';
import Image from 'next/image';
import {ReloadIcon} from '@radix-ui/react-icons'
import { globalSearch } from '@/lib/controllers/global.actions';


const GlobalResult = () => {
    const searchParams=useSearchParams();
    const [isLoading,setIsLoading]=useState(false);
    const [result, setResult] = useState([]);

    const global=searchParams.get('global');
    const type=searchParams.get('type');

    useEffect(()=>{
      const fetchResult=async()=>{
        setIsLoading(true);

        try {
          const res=await globalSearch({query:global,type});
          setResult(JSON.parse(res));

        } catch (error) {
          throw new Error(String(error));
        }finally{
          setIsLoading(false);
        }
      }

      if(global){
        fetchResult();
      }
    },[global,type])

    function renderLink(type:string,id:string){
      switch(type){
        case 'question':
          return `/questions/${id}`;
        
        case 'answer':
          return `/questions/${id}`;
        
        case 'tag':
          return `/tags/${id}`;

        case 'user':
          return `/profile/${id}`;

        default:
          return '/';
      }
    }
    
  return (
    <div className='absolute top-full z-20 mt-3 w-full rounded-xl bg-light-800 py-5 dark:bg-dark-400'>
        <div>
          <GlobalFilters/>
        </div>

        <div className='my-5 h-[1px] bg-light-700/50 dark:bg-dark-500/50'></div>

        <div>
          {isLoading ?  (
            <div className="flex-center flex-col px-5">
            <ReloadIcon className="my-2 h-10 w-10 animate-spin text-primary-500" />
            <p className="text-dark200_light800 body-regular">
              Browsing the entire database
            </p>
          </div>
        ):(
          <div>
            <p className="text-dark400_light900 paragraph-semibold px-5 py-4 text-lg">Top Match</p>
            {
            result.length >0 ?(
              result.map((item:any,index:any)=>(
                <Link
                href={renderLink(item.type, item.id)}
                key={item.id + index}
                className='mb-1 flex items-center gap-3 px-5 py-3 hover:dark:bg-dark-500 hover:bg-light-700'>
                  <Image
                    src={'/assets/icons/tag.svg'}
                    alt="tags"
                    width={18}
                    height={18}
                    className="invert-colors mt-1 object-contain"
                  />
                  <div className="flex flex-col">
                    <p className="body-medium text-dark200_light800 line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-light400_light500 small-medium mt-1 font-bold capitalize">
                      {item.type}
                    </p>
                  </div>
                </Link>
              ))
            ):(
              <div className='px-5 flex flex-col items-center'>
                <div className='text-6xl'>🫣</div>
                Oops! No result found!
              </div>
            )
          }
          </div>
        )
        }   
        </div>

    </div>
  )
}

export default GlobalResult