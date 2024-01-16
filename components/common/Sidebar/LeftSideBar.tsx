'use client'

import { Button } from '@/components/ui/button';
import { sidebarLinks } from '@/constants';
import { SignedOut } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

const LeftSideBar = () => {
    const pathName = usePathname();

    return (
      <section className="background-light900_dark200 custom-scrollbar light-border sticky left-0 top-0 
      flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-28 shadow-light-300 dark:shadow-none
      max-sm:hidden lg:w-[267px]">

        <div>
        {sidebarLinks.map((item) => {
          const isActive =
            (pathName.includes(item.route) && item.route.length > 1) ||
            pathName === item.route;
          return (
            <section key={item.label}>
              <Link
                href={item.route}
                className={`${
                  isActive ? "primary-gradient rounded-lg" : ""
                } text-dark300_light900 flex
                items-center justify-start gap-4 bg-transparent p-4`}
              >
                <Image
                  src={item.imgURL}
                  alt={item.label}
                  width={20}
                  height={20}
                  className="invert dark:invert-0"
                />
  
                <p className={`${isActive ? "base-bold" : "base-medium"} max-lg:hidden`}>
                  {item.label}
                </p>
              </Link>
            </section>
          );
        })}
        </div>

        <SignedOut>
            <div className='flex flex-col gap-5'>
              <Link href={"/sign-in"}>
                <Button
                  className="small-medium btn-secondary
                            min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none"
                >
                  <Image
                  src='/assets/icons/account.svg'
                  alt='Sign In'
                  width={20}
                  height={20}
                  className='invert-colors lg:hidden'/>
                  <span className="primary-text-gradient max-lg:hidden">Sign In</span>
                </Button>
              </Link>
            
              <Link href="/sign-up">
                <Button
                  className="small-medium light-border-2 btn-tertiary text-dark400_light900
                            min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none"
                > 
                  <Image
                  src='/assets/icons/sign-up.svg'
                  alt='Sign In'
                  width={20}
                  height={20}
                  className='invert-colors lg:hidden'/>
                  <span className='max-lg:hidden'>Sign Up</span>
                </Button>
              </Link>
            </div>
        </SignedOut>
      </section>
    );
}

export default LeftSideBar
