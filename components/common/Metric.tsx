import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface propsType{
    alt:string;
    imgUrl:string;
    value?:string;
    title:string;
    href?:string;
    isAuthor?:boolean;
    textStyles:string;
}

const Metric = ({imgUrl,value,title,href,isAuthor,textStyles,alt}:propsType) => {
    const renderMetric = (
          <div className='flex items-center gap-1'>
            <Image
              src={imgUrl}
              alt={alt}
              width={16}
              height={16}
              className='rounded-full'
            />
            <p className={`${textStyles} flex gap-1`}>
                {value}
                <span className={`${isAuthor?"max-sm:hidden":""} line-clamp-1`}>
                    {title}
                </span>
            </p>
          </div>
        );

    if(href){        
        <Link href={href}>
            {renderMetric}
        </Link>
    } 

    return <div>
        {renderMetric}
    </div>

}

export default Metric
