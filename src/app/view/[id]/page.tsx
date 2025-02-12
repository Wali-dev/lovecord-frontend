"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface PostDetails {
    recipient: string;
    message: string;
    createdAt?: string;
    songurl: string;
}

const Page = () => {
    const { id } = useParams();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    // Initialize loading state to true by default
    const [isLoading, setIsLoading] = useState(true);
    const [isClient, setIsClient] = useState(false);
    const [postDetails, setPostDetails] = useState<PostDetails | null>(null);
    const [songId, setSongId] = useState<string | null>(null);

    // Function to extract Spotify track ID
    const getSpotifyTrackId = (url: string) => {
        const match = url.match(/track\/([a-zA-Z0-9]+)/);
        return match ? match[1] : null;
    };

    //Function to format the date
    const formatCreatedAt = (createdAt?: string): string => {
        if (!createdAt) return "Unknown date";
        const date = new Date(createdAt);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    // Effect to mark client-side rendering
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Effect to fetch data
    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;

            try {
                const response = await axios.get(`${backendUrl}/message/${id}`);
                setPostDetails(response.data);
                setSongId(getSpotifyTrackId(response.data.songurl));
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [backendUrl, id]);

    // Loading skeleton
    if (!isClient || isLoading) {
        return (
            <div className="container max-w-2xl mx-auto px-4 py-8">
                <Card className="p-6">
                    <CardContent className="space-y-4">
                        <Skeleton className="h-8 w-48 mx-auto" />
                        <Skeleton className="h-4 w-3/4 mx-auto" />
                        <Skeleton className="h-[300px] w-full rounded-xl" />
                        <Skeleton className="h-4 w-64 mx-auto" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-4 w-32 mx-auto" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Default values for content
    const recipient = postDetails?.recipient || "there";
    const message = postDetails?.message || "No message available.";
    const createdAt = formatCreatedAt(postDetails?.createdAt) || "Unknown date";

    return (
        <div className="container max-w-2xl mx-auto px-1 py-4 pt-4">
            <div className="p-1">
                <CardContent className="space-y-6">
                    <h1 className="text-2xl font-semibold text-center mt-10">
                        Hello, {recipient}
                    </h1>

                    <p className="text-center text-muted-foreground">
                        Someone sends a song your way, hoping it&apos;s one you&apos;ll love today.
                    </p>

                    {songId && (
                        <div className="w-full">
                            <iframe
                                style={{ borderRadius: "12px" }}
                                src={`https://open.spotify.com/embed/track/${songId}?utm_source=generator`}
                                width="100%"
                                height="300"
                                frameBorder="0"
                                allowFullScreen
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                loading="lazy"
                            />
                        </div>
                    )}

                    <div className="space-y-4">
                        <p className="text-center font-medium ">
                            Also, here&apos;s a message from the sender:
                        </p>
                        <div className="bg-muted p-4 rounded-lg">
                            <p className="text-center">{message}</p>
                            <p className="text-center text-sm text-muted-foreground mt-2">
                                <span>Sent </span>
                                {createdAt}
                            </p>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col items-center mt-6">
                    <p className="text-center mb-4">
                        Want to send a song to a friend?
                    </p>
                    <Link href="/submit">
                        <Button className="bg-[#F24463] hover:bg-[#d93753] text-white">
                            Send a song
                        </Button>
                    </Link>
                </CardFooter>
            </div>
        </div>
    );
};

export default Page;