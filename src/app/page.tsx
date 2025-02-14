"use client"
import { Button } from '@/components/ui/button';
import { PenIcon, Search } from 'lucide-react';
import { Fleur_De_Leah } from 'next/font/google'
import { Jura } from 'next/font/google'
import { useRouter } from 'next/navigation';


const fleurFont = Fleur_De_Leah({
  subsets: ["latin"],
  weight: "400",
})
const JuraFont = Jura({
  subsets: ["latin"],
  weight: "400",
})
export default function Home() {
  const router = useRouter()
  return (
    <>
      <div className="mt-20 flex flex-col items-center justify-center mb-10 px-4">

        <p className={`text-5xl ${fleurFont.className} text-center`}>&quot;Music is the divine way to tell beautiful, poetic things to the heart.&quot;</p>
        <p className={`text-xl ${JuraFont.className}`}>– Pablo Casals</p>
        <p className='mt-5 text-center'>Unspoken words woven into the melody, carried by the song.</p>
        <div className='flex gap-5 mt-5'>
          <Button className='' onClick={() => router.replace("/submit")}>Tell your stories<PenIcon /></Button>
          <Button className=' bg-[#F24463]' onClick={() => router.replace("/browse")}>Browse the stories<Search /></Button>
        </div>
      </div>
    </>
  );
}
