'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { questionSchema } from '@/lib/zodValidation';
import { Editor } from '@tinymce/tinymce-react';
import { MdClose } from 'react-icons/md';
import { createQuestion } from '@/lib/controllers/question.action';

const AskQuestionForm = () => {

    createQuestion();
    const {formState:{errors},handleSubmit,register,setValue} = useForm<z.infer<typeof questionSchema>>({
            resolver: zodResolver(questionSchema)  
        })

    const [chips, setChips] = useState<string[]>([]);
    
    function onSubmit(data:z.infer<typeof questionSchema>) {
      console.log("inside form data");

      const newFormData=new FormData();
      newFormData.append('title',data.title);
      newFormData.append('explanation',data.explanation);
      chips.forEach((chip, index) => {
        newFormData.append(`tags[${index}]`, chip);
      });

      
    }


    useEffect(() => {
      setValue('tags', chips);
    }, [chips, setValue]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      const tagInput = event.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();
      if (event.key === "Enter" &&  !chips.includes(tagValue)) {  
        event.preventDefault();
        setChips([...chips, tagValue]);
        tagInput.value= "";
      }
    };  

    const handleDeleteChip = (chipIndex: number) => {
      const newChips=chips.filter((_, index) => index !== chipIndex);
      setChips(newChips);
    }

  
  return (
    <div className='mt-11'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-2'>
              <label className='text-md text-dark400_light800 font-semibold' htmlFor='title'>
                Question Title<sup className=' text-primary-500'>*</sup></label>
              <input
              id='title'
              type='text'
              className='background-light900_dark300 light-border-2 text-dark400_light700 min-h-[56px]
               w-full rounded-md border p-1 focus:outline-0'
              {...register("title",{required:true})}
            //   defaultValue={user?.courseTitle}
              />
              <p className="body-regular mt-0.5 text-light-500"> 
                Be specific and imagine you&apos;re asking a question to another person.
              </p>
                {
                  errors.title &&(
                    <span className='text-yellow-100'>
                      {errors.title.message}
                    </span>
                  )
                }
             
        </div>

        <div className='flex flex-col gap-2'>
              <label className='text-dark400_light800 text-md font-semibold'>
                Question Explanation<sup className=' text-primary-500'>*</sup></label>
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_EDITOR_API_KEY}
                  // onBlur={field.onBlur}
                  // onEditorChange={(content) => field.onChange(content)}
                  onInit={(evt, editor) => {
                    // @ts-ignore
                  }}
                  // initialValue={questionDetails?.content || ''}
                  init={{
                    height: 350,
                    menubar: false,
                    plugins: [
                      'advlist',
                      'autolink',
                      'lists',
                      'link',
                      'image',
                      'charmap',
                      'preview',
                      'anchor',
                      'searchreplace',
                      'visualblocks',
                      'codesample',
                      'fullscreen',
                      'insertdatetime',
                      'media',
                      'table'
                    ],
                    toolbar:
                      'undo redo |  ' +
                      'codesample | bold italic forecolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist ',
                    content_style: 'body { font-family:Inter; font-size:16px }',
            
                  }}
                />
             
        </div>

        <div className="flex flex-col space-y-2">
          <label className='text-md text-dark400_light800 font-semibold' htmlFor='tags'>
            Related Tags <sup className="text-pink-200">*</sup>
          </label>
          <div className="flex w-full flex-wrap gap-y-2">
            {chips.map((chip, index) => (
              <div
                key={index}
                className="text-white m-1 flex items-center rounded-full bg-yellow-400 px-2 py-1 
                text-sm"
              >
                {chip}
                <button
                  type="button"
                  className="ml-2 focus:outline-none"
                  onClick={() => handleDeleteChip(index)}
                >
                  <MdClose className="text-sm" />
                </button>
              </div>
            ))}
            <input
              id='tags'
              type="text"
              onKeyDown={handleKeyDown}
              className='background-light900_dark300 light-border-2 text-dark400_light700 min-h-[56px]
               w-full rounded-md border p-1 focus:outline-0'
            />
          </div>
          {errors.tags && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              {errors.tags.message}
            </span>
          )}
        </div>
        
        <input type='submit'></input>
      </form>
    </div>
  )
}

export default AskQuestionForm
