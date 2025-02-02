"use client"
import React from 'react';
import Link from 'next/link'

const NavBar = () => {
    return (
        <div className='border-b-2 flex items-center justify-evenly min-h-[60px]'>
            <div className='font-extralight text-2xl'>LoveCord</div>
            <div className='flex gap-14'>
                <Link href="/submit" className="cursor-pointer ">
                    Post</Link>
                <Link href="/browse" className="cursor-pointer ">
                    Browse</Link>
                <Link href="/history" className="cursor-pointer ">
                    History</Link>
                <Link href="/support" className="cursor-pointer ">
                    Support</Link>
            </div>
        </div>
    );
};

export default NavBar;