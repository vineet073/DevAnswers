import { SignedIn, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Theme from './Theme'
import MobileNav from './MobileNav'
import GlobalSearchBar from '../SearchBars/GlobalSearchBar'

const Navbar = () => {
  return (
    <nav className='background-light900_dark200 fixed z-50 flex w-full justify-between gap-5 px-8 py-5 
    shadow-light-300 dark:shadow-none'>
      <Link href='/'  className='flex items-center gap-1'>
        <Image
        src='/assets/images/site-logo.svg'
        alt='DevAnswers'
        width={23}
        height={23}
        className=''/>

        <p className='h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900 max-sm:hidden'>
          Dev<span className='text-primary-500'>Answers</span>
        </p>
      </Link>

      <GlobalSearchBar/>

      <div className='flex'>
        <div className='flex'>
          <Theme/>
          <SignedIn>
            <UserButton
            afterSignOutUrl='/'
            appearance={{
              elements:{
                avatarBox:'h-10 w-10'
              },
              variables:{
                colorPrimary: "#ff7000"
              }
            }}/>
          </SignedIn>
        </div>
        
        <MobileNav/>
      </div>
      

    </nav>
  )
}

export default Navbar
