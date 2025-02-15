"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Jura } from 'next/font/google'
import { Fleur_De_Leah } from 'next/font/google'

const JuraFont = Jura({
    subsets: ["latin"],
    weight: "400",
})
const fleurFont = Fleur_De_Leah({
    subsets: ["latin"],
    weight: "400",
})

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className='border-b-2 flex items-center justify-between min-h-[60px] w-full  mx-auto px-4 relative z-[9999]'>
            <Link href='/'><div className={`text-3xl sm:text-5 mr-4 ${fleurFont.className}`} >LoveCord</div></Link>

            <div className={`hidden sm:flex gap-6 font-bold ${JuraFont.className}`}>
                <Link href="/submit" className="cursor-pointer text-lg">
                    Post
                </Link>
                <Link href="/browse" className="cursor-pointer text-lg">
                    Browse
                </Link>
                <Link href="/history" className="cursor-pointer text-lg">
                    History
                </Link>
                <Link href="/support" className="cursor-pointer text-lg">
                    Support
                </Link>
            </div>

            <div className='sm:hidden'>
                <button onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {isOpen && (
                <div className='absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center py-4 sm:hidden z-[9999]'>
                    <Link href="/submit" className={`cursor-pointer text-lg py-2 ${JuraFont.className}`} onClick={() => setIsOpen(false)}>
                        Post
                    </Link>
                    <Link href="/browse" className={`cursor-pointer text-lg py-2 ${JuraFont.className}`} onClick={() => setIsOpen(false)}>
                        Browse
                    </Link>
                    <Link href="/history" className={`cursor-pointer text-lg py-2 ${JuraFont.className}`} onClick={() => setIsOpen(false)}>
                        History
                    </Link>
                    <Link href="/support" className={`cursor-pointer text-lg py-2 ${JuraFont.className}`} onClick={() => setIsOpen(false)}>
                        Support
                    </Link>
                </div>
            )}
        </div>
    );
};

export default NavBar;
