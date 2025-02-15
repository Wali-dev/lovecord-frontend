"use client"
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { AudioLines, PenIcon, Search } from 'lucide-react';
import { Fleur_De_Leah } from 'next/font/google'
import { Jura } from 'next/font/google'
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

import { Beth_Ellen } from 'next/font/google'
import Image from 'next/image';
import Link from 'next/link';

const bethElenFont = Beth_Ellen({
  subsets: ["latin"],
  weight: "400",
})

const fleurFont = Fleur_De_Leah({
  subsets: ["latin"],
  weight: "400",
})
const JuraFont = Jura({
  subsets: ["latin"],
  weight: "400",
})

interface Message {
  _id?: string;
  songimgae: string;
  songname: string;
  id: string;
  recipient: string;
  message: string;
}

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
export default function Home() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([]);
  const [baseUrl, setBaseUrl] = useState('');
  const carouselRef1 = useRef<HTMLDivElement>(null);
  const carouselRef2 = useRef<HTMLDivElement>(null);
  const [width1, setWidth1] = useState(0);
  const [width2, setWidth2] = useState(0);

  // Animation controls for both carousels
  const controls1 = useAnimation();
  const controls2 = useAnimation();

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${backendUrl}/messages/random`);
      const newMessages = response.data.messages;
      setMessages(newMessages);
      console.log(messages)
    } catch (error) {
      console.error("Error fetching messages", error);
    }
  };

  useEffect(() => {
    fetchMessages()
  }, [])

  useEffect(() => {
    const getBaseUrl = () => {
      if (typeof window !== "undefined") {
        return `${window.location.protocol}//${window.location.host}`
      }
      return "http://localhost:3000"
    }
    setBaseUrl(getBaseUrl());
  }, [])

  useEffect(() => {
    if (carouselRef1.current) {
      setWidth1(carouselRef1.current.scrollWidth - carouselRef1.current.offsetWidth);
    }
    if (carouselRef2.current) {
      setWidth2(carouselRef2.current.scrollWidth - carouselRef2.current.offsetWidth);
    }
  }, [messages]);

  // Start animations when component mounts
  useEffect(() => {
    if (width1 > 0 && width2 > 0) {
      startAnimations();
    }
  }, [width1, width2]);

  // Handle window resize to recalculate widths
  useEffect(() => {
    const handleResize = () => {
      if (carouselRef1.current) {
        setWidth1(carouselRef1.current.scrollWidth - carouselRef1.current.offsetWidth);
      }
      if (carouselRef2.current) {
        setWidth2(carouselRef2.current.scrollWidth - carouselRef2.current.offsetWidth);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const startAnimations = () => {
    // Animation for left to right carousel
    controls1.start({
      x: [-width1, 0],
      transition: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 200,
        ease: "linear"
      }
    });

    // Animation for right to left carousel
    controls2.start({
      x: [0, -width2],
      transition: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 200,
        ease: "linear"
      }
    });
  };

  // Functions to handle hover with smooth transitions
  const handleMouseEnter1 = () => {
    controls1.stop();
  };

  const handleMouseLeave1 = () => {
    const currentX = carouselRef1.current?.getBoundingClientRect().x || 0;
    const containerX = carouselRef1.current?.parentElement?.getBoundingClientRect().x || 0;
    const relativeX = currentX - containerX;

    controls1.start({
      x: [relativeX, -width1, 0],
      transition: {
        duration: 200,
        times: [0, 0.5, 1],
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop"
      }
    });
  };

  const handleMouseEnter2 = () => {
    controls2.stop();
  };

  const handleMouseLeave2 = () => {
    const currentX = carouselRef2.current?.getBoundingClientRect().x || 0;
    const containerX = carouselRef2.current?.parentElement?.getBoundingClientRect().x || 0;
    const relativeX = currentX - containerX;

    controls2.start({
      x: [relativeX, 0, -width2],
      transition: {
        duration: 200,
        times: [0, 0.5, 1],
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop"
      }
    });
  };
  // Duplicate messages for infinite effect
  const duplicatedMessages = [...messages, ...messages, ...messages];

  return (
    <>
      <div className="mt-20 flex flex-col items-center justify-center mb-10 px-4">
        <p className={`text-5xl md:text-4xl sm:text-3xl ${fleurFont.className} text-center`}>&quot;Music is the divine way to tell beautiful, poetic things to the heart.&quot;</p>
        <p className={`text-xl md:text-lg sm:text-base ${JuraFont.className}`}>– Pablo Casals</p>
        <p className='mt-5 text-center font-serif'>Unspoken words woven into the melody, carried by the song.</p>
        <div className='flex flex-wrap justify-center gap-5 mt-5 mb-10'>
          <Button className='' onClick={() => router.replace("/submit")}>Tell your stories<PenIcon className="ml-2" /></Button>
          <Button className='bg-[#F24463]' onClick={() => router.replace("/browse")}>Browse the stories<Search className="ml-2" /></Button>
        </div>

        {/* Left to Right Infinite Scrolling Carousel */}
        <div
          className="w-full overflow-hidden my-5"
          onMouseEnter={handleMouseEnter1}
          onMouseLeave={handleMouseLeave1}
          onTouchStart={handleMouseEnter1}
          onTouchEnd={handleMouseLeave1}
        >
          <motion.div
            ref={carouselRef1}
            className="flex"
            drag="x"
            dragConstraints={{ right: 0, left: -width1 }}
            initial={{ x: 0 }}
            animate={controls1}
          >
            {duplicatedMessages.map((msg, index) => (
              <motion.div
                key={`left-to-right-${index}`}
                className="h-56 w-72 md:w-80 sm:w-64 xs:w-56 flex-shrink-0 mx-2 sm:mx-3 md:mx-4 rounded-lg flex flex-col justify-between border shadow-sm relative rounded-br-lg rounded-bl-lg transition-shadow hover:shadow-md"
              >
                <div className="font-bold p-3 truncate">To: {msg.recipient}</div>
                <p className={`text-base sm:text-lg p-3 flex-grow ${bethElenFont.className} overflow-hidden`}>
                  {msg.message.length > 50 ? `${msg.message.slice(0, 50)}...` : msg.message}
                </p>
                <Link href={`${baseUrl}/view/${msg?._id}`} target="_blank" rel="noopener noreferrer">
                  <div className="bg-slate-200 h-16 flex items-center justify-around px-3 sm:px-4 py-2 rounded-br-lg rounded-bl-lg shadow-sm">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Image
                        src={msg?.songimgae || '/placeholder.jpg'}
                        alt={msg?.songname || 'Song'}
                        width={40}
                        height={40}
                        className="rounded w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12"
                      />
                      <div className="text-xs sm:text-sm truncate max-w-20 sm:max-w-24 md:max-w-32">{msg?.songname}</div>
                    </div>
                    <div className="ml-auto lg:mr-0">
                      <AudioLines size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right to Left Infinite Scrolling Carousel */}
        <div
          className="w-full overflow-hidden my-5"
          onMouseEnter={handleMouseEnter2}
          onMouseLeave={handleMouseLeave2}
          onTouchStart={handleMouseEnter2}
          onTouchEnd={handleMouseLeave2}
        >
          <motion.div
            ref={carouselRef2}
            className="flex"
            drag="x"
            dragConstraints={{ right: 0, left: -width2 }}
            initial={{ x: 0 }}
            animate={controls2}
          >
            {duplicatedMessages.map((msg, index) => (
              <motion.div
                key={`right-to-left-${index}`}
                className="h-56 w-72 md:w-80 sm:w-64 xs:w-56 flex-shrink-0 mx-2 sm:mx-3 md:mx-4 rounded-lg flex flex-col justify-between border shadow-sm relative rounded-br-lg rounded-bl-lg transition-shadow hover:shadow-md"
              >
                <div className="font-bold p-3 truncate">To: {msg.recipient}</div>
                <p className={`text-base sm:text-lg p-3 flex-grow ${bethElenFont.className} overflow-hidden`}>
                  {msg.message.length > 50 ? `${msg.message.slice(0, 50)}...` : msg.message}
                </p>
                <Link href={`${baseUrl}/view/${msg?._id}`} target="_blank" rel="noopener noreferrer">
                  <div className="bg-slate-200 h-16 flex items-center justify-around px-3 sm:px-4 py-2 rounded-br-lg rounded-bl-lg shadow-sm">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Image
                        src={msg?.songimgae || '/placeholder.jpg'}
                        alt={msg?.songname || 'Song'}
                        width={40}
                        height={40}
                        className="rounded w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12"
                      />
                      <div className="text-xs sm:text-sm truncate max-w-20 sm:max-w-24 md:max-w-32">{msg?.songname}</div>
                    </div>
                    <div className="ml-auto lg:mr-0">
                      <AudioLines size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}