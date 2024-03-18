'use client'

import { Button } from '@/components/ui/button'
import { FormControl, FormDescription, FormField, FormItem, FormMessage,Form } from '@/components/ui/form'
import { useTheme } from '@/context/ThemeContext/ThemeProvider'
import { createAnswer } from '@/lib/controllers/answer.actions'
import { answerSchema } from '@/lib/zodValidation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Editor } from '@tinymce/tinymce-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface propsType{
    authorID:string,
    questionID:string,
    question:string
}

const AnswerForm = ({authorID,questionID,question}:propsType) => {
    const {mode}=useTheme();
    const pathName=usePathname();
    console.log("pathName-->",pathName);
    const editorRef=useRef(null);

    const form = useForm<z.infer<typeof answerSchema>>({
        resolver: zodResolver(answerSchema),
        defaultValues:{
          answer:""
        }  
    });

    async function onSubmitHandler(values:z.infer<typeof answerSchema>){
        try {
            const saveAnswer=await createAnswer({
                content:values.answer,
                author:JSON.parse(authorID),
                question:JSON.parse(questionID),
                path:pathName
            });

            form.reset();

            if(editorRef.current){
                // @ts-ignore
                editorRef.current.setContent("");
            }

            console.log("saved answer-->",saveAnswer);
            
        } catch (error) {
            console.log("error in submit answer function:",error);
        }
    }


  return (
    <div className='mt-14'>
        <div className='mb-5 flex items-center justify-between'>
            <h4 className='text-dark100_light900 font-semibold text-xl'>Explain your answer</h4>

            <Button className='background-light800_dark400 flex gap-2 border-none'>
                <Image
                    src="/assets/icons/stars.svg"
                    alt="star"
                    width={12}
                    height={12}
                    className="object-contain"
                />

                <p className='text-primary-500'>Generate AI Answer</p>
            </Button>
        </div>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitHandler)}>
                <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                    <FormItem>
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
                            min_width:350,
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
                            Explain the answer as you are explaining a person sitting next to you. Minimum 50 characters.
                        </FormDescription>
                        <FormMessage className="text-red-500"/>
                    </FormItem>
                )}
                />

                <Button type="submit" className="primary-gradient mt-4 min-h-[46px] text-base text-light-900">Submit</Button>
            </form>
            
        </Form>
    </div>
  )
}

export default AnswerForm