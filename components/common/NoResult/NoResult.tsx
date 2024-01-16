import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

interface propsType{
    title:string;
    description:string;
    link:string;
    linkTitle:string
}

const NoResult = ({title,description,link,linkTitle}:propsType) => {
  return (
    <div className='flex flex-col items-center'>
        <Image
            src="/assets/images/light-illustration.png"
            alt="No result illustration"
            width={270}
            height={200}
            className="block object-contain dark:hidden"
        />
        <Image
            src="/assets/images/dark-illustration.png"
            alt="No result illustration"
            width={270}
            height={200}
            className="hidden object-contain dark:flex"
        />

        <div className='flex flex-col items-center'>
            <h1 className="h2-bold text-dark200_light900 mt-8">{title}</h1>
            <p className="body-regular text-dark500_light700 my-3.5 max-w-md text-center">{description}</p>

            <Link href={link}>
                <Button className="paragraph-medium mt-5 min-h-[46px]
                rounded-lg bg-primary-500 px-4 py-3 text-light-900
                hover:bg-primary-500 dark:bg-primary-500 dark:text-light-900">
                    {linkTitle}
                </Button>
            </Link>
        </div>
    </div>
  )
}

export default NoResult
