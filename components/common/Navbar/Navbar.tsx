import { SignedIn, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Theme from './Theme'
import MobileNav from './MobileNav'

const Navbar = () => {
  return (
    <nav className='flex-between background-light900_dark200 fixed z-50 w-full gap-5 py-5 px-8 
    shadow-light-300 dark:shadow-none'>
      <Link href='/'  className='flex items-center gap-1'>
        <Image
        src='/assets/images/site-logo.svg'
        alt='DevOverFlow'
        width={23}
        height={23}
        className=''/>

        <p className='h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900 max-sm:hidden'>
          Dev<span className='text-primary-500'>Overflow</span>
        </p>
      </Link>

      {/* global-search */}

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

    </nav>
  )
}

export default Navbar
