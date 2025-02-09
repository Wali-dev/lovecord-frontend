"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";

const History = () => {
    const [messageUrls, setMessageUrls] = useState<string[]>([]);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    useEffect(() => {
        // Retrieve messages from localStorage
        const savedMessages = localStorage.getItem('messageUrls');
        if (savedMessages) {
            try {
                const parsedUrls = JSON.parse(savedMessages);
                if (Array.isArray(parsedUrls)) {
                    setMessageUrls(parsedUrls);
                }
            } catch (error) {
                console.error('Error parsing message URLs:', error);
                setMessageUrls([]);
            }
        }
    }, []);

    const handleCopy = async (url: string, index: number) => {
        try {
            await navigator.clipboard.writeText(url);
            setCopiedIndex(index);
            setTimeout(() => {
                setCopiedIndex(null);
            }, 2000);
        } catch (error) {
            console.error('Failed to copy URL:', error);
        }
    };

    return (
        <div className="mt-10 mb-16 mx-2">
            <div className="p-3 text-white bg-black text-center sm:max-w-3xl mx-auto flex items-center justify-center gap-2 rounded-md mb-6">
                <span className="text-sm sm:text-base">
                    Your history will be removed after your cookies are deleted 😁
                </span>
            </div>

            <div className="space-y-4 w-full sm:max-w-3xl mx-auto">
                {messageUrls.length === 0 ? (
                    <div className="bg-slate-100 border-2 border-black rounded-md p-6 text-center text-gray-600">
                        No previous found in your history
                    </div>
                ) : (
                    messageUrls.map((url, index) => (
                        <div key={index} className="bg-slate-100 border-2 border-black rounded-md p-3">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <Link
                                    href={url}
                                    className="underline break-all text-sm sm:text-base hover:text-blue-600 transition-colors"
                                >
                                    {url}
                                </Link>
                                <Button
                                    className="h-8 px-4 text-xs sm:text-sm flex items-center gap-2"
                                    onClick={() => handleCopy(url, index)}
                                >
                                    {copiedIndex === index ? (
                                        <>
                                            <Check size={14} />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={14} />
                                            Copy Link
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default History;