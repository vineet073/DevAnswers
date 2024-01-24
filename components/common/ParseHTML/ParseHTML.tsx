'use client'

import React, { useEffect } from 'react'
import prism from 'prismjs';
import parse from 'html-react-parser';

interface params {
  data: string;
}

const ParseHTML = ({data}:params) => {

    useEffect(()=>{
        prism.highlightAll();
    },[])

  return (
    <div>
      {parse(data)}
    </div>
  )
}

export default ParseHTML
