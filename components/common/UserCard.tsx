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
      <div className='background-light900_dark300 rounded-md shadow-sm dark:shadow-none p-7 flex flex-col items-center justify-center w-[220px]'>
        <Image
        src={user.picture}
        alt="user-profile-picture"
        width={100}
        height={100}
        className="rounded-full"
        />

        <p className='text-dark300_light900 h3-bold my-2 line-clamp-1'>{user.name}</p>
        <p className='text-dark500_light500 text-sm'>@ {user.username}</p>
        <div className='flex gap-1 mt-2'>
            {
                result.length>0 && (
                    result.map((item)=>(
                        <RenderTags key={item._id} _id={item._id} name={item.name}/>
                    ))
                )
            }
        </div>
      </div>
    </Link>
  )
}

export default UserCard
