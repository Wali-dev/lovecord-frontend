"use client"
import React from 'react';
import Link from 'next/link';
import { Jura } from 'next/font/google'


const JuraFont = Jura({
    subsets: ["latin"],
    weight: "400",
})
const Footer = () => {
    return (
        <footer className="border-t-2 text-center py-4 w-full">
            <div className={`flex flex-wrap justify-center gap-4 text-base ${JuraFont.className}`}>
                <Link href="https://docs.google.com/forms/d/e/1FAIpQLSfiDxD5wJ3tPxFqo18WvwIvFMlUylWzKqBwFGukYg72XsHrtQ/viewform?usp=header" className="cursor-pointer hover:underline">
                    Feedback
                </Link>
                <Link href="/about-us" className="cursor-pointer hover:underline">
                    About Us
                </Link>
                <Link href="/support" className="cursor-pointer hover:underline">
                    Support
                </Link>
            </div>
            <p className="mt-2 font-serif text-sm ">2025 LoveCord. All rights reserved.</p>
        </footer>
    );
};
export default Footer;