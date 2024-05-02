import { getTopIneractedTags } from '@/lib/controllers/tag.actions';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import RenderTags from './RenderTags/RenderTags';


interface PropsType{
    user:{
        _id:string;
        name:string;
        picture:string;
        username:string;
        clerkId:string;
    }
}

const UserCard = async({user}:PropsType) => {

    const result=await getTopIneractedTags({userId:user._id});

  return (
    <Link href={`/profile/${user.clerkId}`} className=''>
      <div className='background-light900_dark300 flex w-[250px] flex-col items-center justify-center rounded-md p-7 shadow-sm dark:shadow-none'>
        <Image
        src={user.picture}
        alt="user-profile-picture"
        width={100}
        height={100}
        className="rounded-full"
        />

        <p className='text-dark300_light900 h3-bold my-2 line-clamp-1'>{user.name}</p>
        <p className='text-dark500_light500 text-sm'>@ {user.username}</p>
        <div className='mt-2 flex flex-wrap gap-1'>
            {
              result.length>0 && (
                  result.map((item)=>(
                      <RenderTags key={item._id} _id={item._id} name={item.name} customClasses=''/>
                  ))
              )
            }
        </div>
      </div>
    </Link>
  )
}

export default UserCard
