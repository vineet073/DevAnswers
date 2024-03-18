import AnswerTab from '@/components/common/AnswerTab/AnswerTab';
import QuestionTab from '@/components/common/QuestionTab/QuestionTab';
import Stats from '@/components/common/UserStats/Stats';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getProfileData } from '@/lib/controllers/user.actions';
import { formatDate } from '@/lib/utility';
import { URLProps } from '@/types/types';
import { auth } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { FaLink, FaLocationDot } from "react-icons/fa6";
import { SlCalender } from "react-icons/sl";

const ProfilePage = async({params,searchParams}:URLProps) => {
    const userId=(params.user_id);
    const userInfo=await getProfileData({userId});
    const {userId:clerkId}=auth();
  return (
    <div>
        <div className='flex gap-5'>
            <div>
                <Image src={userInfo.user.picture}
                alt='profile-pic'
                width={130}
                height={130}
                className='rounded-full'/>

            </div>

            <div className='text-dark200_light800 w-full'>
                <div className='flex w-full justify-between max-sm:flex-col-reverse'>
                    <p className='text-2xl font-semibold'>{userInfo.user.name}</p>
                    <div className='flex justify-end max-sm:w-full'>
                        <Button className='background-light800_dark400 text-dark300_light900 text-md px-8 '>
                            {clerkId===userInfo.user.clerkId && 'Edit Profile'}
                        </Button>
                    </div>
                    
                </div>

                <p className='mb-3'>@{userInfo.user.username}</p>

                <div className='text-sm justify-between flex max-md:flex-col'>
                    {userInfo.user.portfolioWebSite && (
                        <Link href={userInfo.user.portfolioWebSite} className='flex items-center text-accent-blue font-medium gap-1'>
                            <FaLink/>
                            Portfolio Website
                        </Link>
                    )}
                    {
                        userInfo.user.location && (
                            <div className='flex items-center gap-1'>
                                <FaLocationDot/>
                                <p>{userInfo.user.location}</p>
                            </div>
                        )
                    }
                    {
                        userInfo.user.joinAt && (
                            <div className='flex items-center gap-2'>
                                <SlCalender/>
                                <p>Joined {formatDate(userInfo.user.joinAt)}</p>
                            </div>
                        )
                    }
                </div>  

                <div className='my-5 text-sm'>
                {
                    userInfo.user.bio && (
                        <p>{userInfo.user.bio}</p>
                    )
                }</div>              
                
            </div>
        </div>

        <div>
           <Stats/>
        </div>

        <Tabs defaultValue="topPosts" className="">
        <TabsList className='background-light800_dark400'>
            <TabsTrigger value="topPosts" className='tab text-md'>Top Posts</TabsTrigger>
            <TabsTrigger value="answers" className='tab text-md'>Answers</TabsTrigger>
        </TabsList>
        <TabsContent value="topPosts" className=''>
            <QuestionTab userId={userInfo.user._id} clerkId={userId}/>
        </TabsContent>
        <TabsContent value="answers">
            <AnswerTab userId={userInfo.user._id} clerkId={userId}/>
        </TabsContent>
        </Tabs>

    </div>
  )
}

export default ProfilePage