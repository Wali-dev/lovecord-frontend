"use client"
import React from 'react';
import Link from 'next/link'

const Footer = () => {
    return (
        <footer className="border-t-2 text-center py-6">
            <div className="flex justify-center gap-4">
                <Link href="/feedback" className="cursor-pointer hover:underline">
                    Feedback</Link>
                <Link href="/about-us" className="cursor-pointer hover:underline">
                    About Us</Link>
                <Link href="/support" className="cursor-pointer hover:underline">
                    Support</Link>

            </div>
            <p className="mt-3 text-sm">2025 LoveCord. All rights reserved.</p>
        </footer>
    );
};

export default Footer;