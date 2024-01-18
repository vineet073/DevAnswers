'use client';

import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { questionSchema } from '@/lib/zodValidation';
import { Editor } from '@tinymce/tinymce-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext/ThemeProvider';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { createQuestion } from '@/lib/controllers/question.action';
import { usePathname, useRouter } from 'next/navigation';

interface QuestionProps {
  type?: string;
  mongoUserId: string;
  questionData?: string;
}

const AskQuestionForm = ({mongoUserId}:QuestionProps) => {
  const editorRef=useRef(null);
  const {mode}=useTheme();
  const pathname=usePathname();
  const router=useRouter();

  const form = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues:{
      title:"",
      explanation:'',
      tags:[]
    }  
  })
  
  function onSubmit(data:z.infer<typeof questionSchema>) {
    try {
      createQuestion({
        title:data.title, 
        content:data.explanation,
        tags:data.tags,
        author:JSON.parse(mongoUserId),
        path:pathname
      });

      router.push('/');

    } catch (error) {
      console.log("error while creating question:",error);
    }
  }

  function handleKeyDown(e:React.KeyboardEvent<HTMLInputElement> , field:any){
    if(e.key==='Enter'){
      e.preventDefault();

      const tagInput=e.target as HTMLInputElement;
      const tagValue=tagInput.value.trim();

      if(tagValue!==''){
        if(!field.value.includes(tagValue as never)){
          form.setValue('tags',[...field.value, tagValue]);
          tagInput.value='';
          form.clearErrors('tags');
        }else{
          form.trigger();
        }
      }
    }
  }

  const handleTagRemove = (tag: string, field: any) => {
    const newTags = field.value.filter((t: string) => t !== tag);
    form.setValue('tags', newTags);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
               Question Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input  {...field} 
                className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark400_light700 min-h-[56px] border"
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
              Be specific and imagine you&apos;re asking a question to another person.
              </FormDescription>
              <FormMessage className="text-red-500"/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
               Question Explanation <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Editor
                apiKey={process.env.NEXT_PUBLIC_EDITOR_API_KEY}
                onBlur={field.onBlur}
                onEditorChange={(content) => field.onChange(content)}
                onInit={(evt, editor) => {
                  // @ts-ignore
                  editorRef.current = editor;
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
                  skin: mode === 'dark' ? 'oxide-dark' : 'oxide',
                  content_css: mode === 'dark' ? 'dark' : 'light'
                }}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
              Introduce the problem and expand on what you put in the title. Minimum 20 characters.
              </FormDescription>
              <FormMessage className="text-red-500"/>
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Related Tags</FormLabel>
              <FormControl>
                <>
                <Input  {...field} onKeyDown={(e)=>handleKeyDown(e,field)} />
                {
                  field.value.length > 0  && (
                    <div>
                      {
                        field.value.map((item:any)=>(
                          <Badge key={item} className='flex'>
                            {item}
                            <MdClose/>
                          </Badge>
                        ))
                      }
                    </div>
                  )
                }
                </>

              </FormControl>
              <FormDescription>
              Be specific and imagine you&apos;re asking a question to another person.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5 ">
                <>
                  <Input
                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark400_light700 min-h-[56px] border"
                    placeholder="Add tags..."
                    onKeyDown={(e) => handleKeyDown(e, field)}
                  />
                  {field.value.length > 0 && (
                    <div className="flex-start mt-2.5 gap-2.5">
                      {field.value.map((tag: any) => (
                        <Badge
                          key={tag}
                          className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize"
                          onClick={() =>handleTagRemove(tag, field)
                          }
                        >
                          {tag}{' '}
  
                            <Image
                              src="/assets/icons/close.svg"
                              alt="close icon"
                              width={12}
                              height={12}
                              className="cursor-pointer object-contain invert-0 dark:invert"
                            />

                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Add up to 3 tags to describe what your question is about. You
                need to press enter to add a tag.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button type="submit" className="primary-gradient min-h-[46px] text-base text-light-900">Submit</Button>
      </form>
  </Form>
  )
}

export default AskQuestionForm
