"use client";

import { CircleAlert, Loader2 } from "lucide-react";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface FormData {
    recipient: string;
}

interface Message {
    id: string;
    recipient: string;
    message: string;
}

const Browse = () => {
    const form = useForm<FormData>();
    const { handleSubmit, control } = form;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef<IntersectionObserver | null>(null);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const fetchMessages = async (recipient: string, pageNum: number) => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const response = await axios.get(`${backendUrl}/messages/recipient`, {
                params: { recipient, page: pageNum, per_page: 5 },
            });
            const newMessages = response.data.messages;
            setMessages((prev) => [...prev, ...newMessages]);
            setHasMore(newMessages.length > 0);
        } catch (error) {
            console.error("Error fetching messages", error);
        }
        setLoading(false);
    };

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        setMessages([]);
        setPage(1);
        setHasMore(true);
        await fetchMessages(data.recipient, 1);
        setIsSubmitting(false);
    };

    const lastMessageRef = useCallback(
        (node: HTMLElement | null) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prev) => prev + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    useEffect(() => {
        if (page > 1) {
            fetchMessages(form.getValues("recipient"), page);
        }
    }, [page]);

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
            <div className="font-mono mb-5 px-4 sm:max-w-3xl text-center text-sm">
                We’d love to hear your feedback and suggestions to help us improve LoveChord. Click here to share your thoughts with us!
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
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                                </>
                            ) : (
                                "Search"
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:max-w-3xl w-full">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className="h-56 rounded-lg flex flex-col justify-between border shadow-sm relative"
                        ref={index === messages.length - 1 ? lastMessageRef : undefined}
                    >
                        <div className="font-bold text-lg p-3">To: {msg.recipient}</div>
                        <p className="font-mono text-2xl p-3 flex-grow ">
                            {msg.message}
                        </p>

                        <div className="bg-slate-400 absolute bottom-0 left-0 right-0 h-16">
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                ))}
            </div>
            {loading && <Loader2 className="animate-spin mt-4" />}
        </div>
    );
};

export default Browse;
