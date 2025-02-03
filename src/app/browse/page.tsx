"use client"

import { CircleAlert, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from "react-hook-form"
import axios from 'axios'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface FormData {
    recipient: string;
}

const Browse = () => {
    const form = useForm<FormData>()
    const { handleSubmit, control } = form
    const [isSubmitting, setIsSubmitting] = useState(false)

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true)
        console.log(data)
    }

    return (
        <div className="mt-10 flex flex-col items-center justify-center mb-10 px-4">

            <div className="p-3 text-white bg-black sm:max-w-3xl w-full flex items-start gap-3 rounded-md mb-6">
                <CircleAlert color="white" className="mt-1" />
                <div>
                    <p className="font-medium">Find Message</p>
                    <p className="text-sm">
                        Scroll the latest messages or start typing the recipient&apos;s name to find your messages.
                    </p>
                </div>
            </div>
            <div className='font-mono  mb-5 px-4 sm:max-w-3xl text-center text-sm'>
                We’d love to here your feedback and suggestions to help us improve LoveChord.
                Click here to share your thoughts with us!!!
            </div>
            <div className="w-full sm:max-w-3xl mb-5">
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3">
                        <FormField
                            control={control}
                            name="recipient"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <Input placeholder="Recipient's name" {...field} className="w-full" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isSubmitting} className="bg-[#F24463] w-full sm:w-auto">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </>
                            ) : (
                                'Search'
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
            <div className='card-section grid grid-cols-2 gap-2 sm:max-w-3xl'>
                <Card>
                    <CardHeader>
                        <CardTitle>To: name</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Message: Lorem ipsum dolor sitronem saepe harum nostrum porro tempora doloribus unde rem?</p>
                    </CardContent>
                    <CardFooter>
                        <p>Card Footer</p>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>To: name</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Message: Lorem ipsum dolor sitronem saepe harum nostrum porro tempora doloribus unde rem?</p>
                    </CardContent>
                    <CardFooter>
                        <p>Card Footer</p>
                    </CardFooter>
                </Card>
            </div>
        </div>

    );
};

export default Browse;