"use client"

import { CircleAlert, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from "react-hook-form"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import axios from 'axios'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface FormData {
    recipient: string;
    message: string;
    song: string;
}

const Submit = () => {
    const { toast } = useToast()
    const router = useRouter()
    const form = useForm<FormData>()
    const { handleSubmit, control } = form
    const [isSubmitting, setIsSubmitting] = useState(false)

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true)
        try {
            await axios.post('/api/send-message', data)
            toast({
                title: 'Success',
                description: 'Message sent successfully'
            })
            router.replace('/history')
        } catch (error) {
            console.error("error in sending message", error)
            toast({
                title: "Message sending failed",
                description: "An error occurred",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="mt-10 flex flex-col items-center justify-center mb-10 mx-8">
            <div className='p-3 text-white bg-black text-wrap sm:max-w-3xl mx-auto flex gap-1 rounded-md mb-6'>
                <CircleAlert color='white' />
                <div>
                    <p>Posts Deletion Not Available</p>
                    <p className='text-sm'>
                        Currently, we do not support post deletion. Once a post is posted, it cannot be removed. Please ensure your posts are appropriate before submitting.
                    </p>
                </div>
            </div>
            <div className="w-full max-w-3xl">
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={control}
                            name="recipient"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Recipient</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Recipient's name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Message</FormLabel>
                                    <FormControl>
                                        <textarea placeholder="Your message" className="h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="song"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Song</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Song title" className='h-10' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting} className="w-full bg-[#F24463]">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </>
                            ) : (
                                'Send'
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default Submit;