"use client"
import React from 'react';
import Link from 'next/link'

const NavBar = () => {
    return (
        <div className='border-b-2 flex items-center justify-between min-h-[60px] sm:max-w-3xl mx-auto px-2 sm:px-0'>
            <div className='font-extralight text-xl sm:text-2xl lg:text-3xl mr-2'>LoveCord</div>
            <div className='flex gap-2 sm:gap-8 lg:gap-14'>
                <Link href="/submit" className="cursor-pointer text-sm sm:text-base lg:text-lg">
                    Post
                </Link>
                <Link href="/browse" className="cursor-pointer text-sm sm:text-base lg:text-lg">
                    Browse
                </Link>
                <Link href="/history" className="cursor-pointer text-sm sm:text-base lg:text-lg">
                    History
                </Link>
                <Link href="/support" className="cursor-pointer text-sm sm:text-base lg:text-lg">
                    Support
                </Link>
            </div>
        </div>
    );
};

export default NavBar;