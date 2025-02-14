import React, { useState } from 'react';
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Copy, X } from 'lucide-react';

interface OnSubmitPopupProps {
    linkToCopy: string;
    onClose: () => void;
}

const OnSubmitPopup: React.FC<OnSubmitPopupProps> = ({ linkToCopy, onClose }) => {
    const [copied, setCopied] = useState(false);


    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(linkToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <Card className="min-w-72 sm:max-w-2xl mx-auto bg-gradient-to-r from-rose-50 to-pink-50 border-2 border-rose-100 relative">
            <Button
                onClick={onClose}
                variant="ghost"
                className="absolute right-2 top-2 hover:bg-rose-100 rounded-full p-2 h-auto"
            >
                <X size={20} />
            </Button>

            <CardContent className="px-2 sm:p-6 space-y-6">
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="h-px sm:w-16 bg-gradient-to-r from-transparent via-rose-300 to-transparent my-4" />
                    </div>

                    <p className="font-serif text-xl text-rose-700 italic">
                        Share this cherished link, a bridge of hearts,
                    </p>
                    <p className="font-serif text-xl text-rose-700 italic">
                        Where your thoughts bloom like petals in the breeze
                    </p>

                    <div className="flex justify-center">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent via-rose-300 to-transparent my-4" />
                    </div>
                </div>

                <div className="flex flex-col gap-4 items-center">
                    <div className="w-full max-w-md flex gap-2">
                        <Input
                            value={linkToCopy}
                            readOnly
                            className="bg-white border-rose-200 focus-visible:ring-rose-400"
                        />
                        <Button
                            onClick={handleCopy}
                            className="bg-rose-500 hover:bg-rose-600 transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
                        >
                            {copied ? (
                                <>
                                    <Check size={16} /> Copied!
                                </>
                            ) : (
                                <>
                                    <Copy size={16} /> Copy
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default OnSubmitPopup;