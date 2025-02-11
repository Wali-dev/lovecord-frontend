"use client"

import { CircleAlert, Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import axios from 'axios'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useDebounceCallback } from 'usehooks-ts'
import Image from 'next/image'
import OnSubmitPopup from '@/components/OnSubmitPopup'


interface FormData {
    recipient: string
    message: string
    song: string
}

interface Song {
    external_urls: {
        spotify: string
    }
    name: string
    album: {
        images: { url: string }[]
    }
}

const Submit: React.FC = () => {
    const router = useRouter()
    const form = useForm<FormData>()
    const { handleSubmit, control } = form

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSubmitPopUp, setshowSubmitPopUp] = useState(false)
    const [blurBg, setBlurBg] = useState(" ")
    const [afterSelection, setafterSelection] = useState(true)
    const [songName, setSongname] = useState('')
    const [selectedSongUrl, setSelectedSongUrl] = useState('')
    const [selectedSongName, setSelectedSongName] = useState('')
    const [selectedSongImage, setSelectedSongImage] = useState('')
    const [songList, setSongList] = useState<Song[]>([])
    const [selectedSongDiv, setSelectedSongDiv] = useState<React.ReactNode | null>(null)
    const [accessToken, setAccessToken] = useState('')
    const [generatedUrl, setGeneratedUrl] = useState(' ')


    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

    const client_Id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
    const client_Secret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET

    const debounced = useDebounceCallback((value: string) => {
        setafterSelection(true)
        setSongname(value)
    }, 1000)

    const selectSong = (song: Song, index: number) => {
        const songDiv = (
            <div
                key={index}
                className='bg-gray-200 flex justify-start gap-2 items-center p-2 border-b cursor-pointer hover:bg-gray-200'
            >
                <Image
                    src={song.album.images[2]?.url}
                    alt={song.name}
                    width={40}
                    height={40}
                    className='rounded'
                />
                <h3>{song.name}</h3>
            </div>
        )

        setSelectedSongDiv(songDiv)
        setSelectedSongUrl(song?.external_urls?.spotify)
        setSelectedSongName(song?.name)
        setSelectedSongImage(song.album.images?.[2]?.url)

    }

    const handleSaveOnLocalMachine = (messageUrl: string) => {
        const existingMessages = localStorage.getItem('messageUrls')
        let messageUrls: string[] = []

        if (existingMessages) {
            try {
                messageUrls = JSON.parse(existingMessages)
                if (!Array.isArray(messageUrls)) {
                    messageUrls = []
                }
            } catch (error) {
                console.error('Error parsing message URLs from localStorage:', error)
                messageUrls = []
            }
        }

        if (!messageUrls.includes(messageUrl)) {
            messageUrls.push(messageUrl)
        }

        try {
            localStorage.setItem('messageUrls', JSON.stringify(messageUrls))
        } catch (error) {
            console.error('Error saving message URLs to localStorage:', error)
        }
    }

    const generateUrl = (messageID: string) => {
        const getBaseUrl = () => {
            if (typeof window !== "undefined") {
                return `${window.location.protocol}//${window.location.host}`
            }
            return "http://localhost:3000"
        }
        const baseUrl = getBaseUrl()
        const messageUrl = `${baseUrl}/view/${messageID}`
        handleSaveOnLocalMachine(messageUrl)
        return messageUrl
    }

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true)

        try {
            const response = await axios.post(`${backendUrl}/message`, {
                recipient: data.recipient,
                message: data.message,
                songurl: selectedSongUrl,
                songname: selectedSongName,
                songimage: selectedSongImage
            })

            setTimeout(() => {
                setBlurBg('blur-sm')
            }, 500)

            setshowSubmitPopUp(true)
            setGeneratedUrl(generateUrl(response.data.id))
        } catch (error) {
            console.error("error in sending message", error)
        } finally {
            setIsSubmitting(false)
        }
    }



    useEffect(() => {
        const getfreshAccessToken = async () => {
            try {
                const response = await axios.post(
                    "https://accounts.spotify.com/api/token",
                    new URLSearchParams({
                        grant_type: "client_credentials",
                        client_id: client_Id ?? "",
                        client_secret: client_Secret ?? "",
                    }).toString(),
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                    }
                );
                setAccessToken(response.data.access_token)
            } catch (error) {
                console.error(error)
            } finally {
                setIsSubmitting(false)
            }
        }

        getfreshAccessToken()
    }, [])

    useEffect(() => {
        const getSongs = async () => {
            if (!songName) return
            setIsSubmitting(true)
            try {
                const response = await axios.get(
                    `https://api.spotify.com/v1/search?q=${songName}&type=track&limit=5`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                )
                setSongList(response.data.tracks.items)
            } catch (error) {
                console.error(error)
            } finally {
                setIsSubmitting(false)
            }
        }
        getSongs()
    }, [songName, accessToken])

    return (
        <div className='relative'>
            {showSubmitPopUp && (
                <div className='z-10 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                    <OnSubmitPopup
                        linkToCopy={generatedUrl}
                        onClose={() => {
                            setshowSubmitPopUp(false)
                            setBlurBg('')
                            setTimeout(() => {
                                router.replace('/history')
                            }, 500)
                        }}
                    />
                </div>
            )}

            <div className={`mt-10 flex flex-col items-center justify-center mb-10 mx-8 ${blurBg}`}>
                <div className='p-3 text-white bg-black text-wrap sm:max-w-3xl mx-auto flex gap-1 rounded-md mb-6'>
                    <CircleAlert color='white' />
                    <div>
                        <p>Posts Deletion Not Available</p>
                        <p className='text-sm'>
                            Currently, we do not support post deletion. Once a post is posted, it cannot be removed. Please ensure your posts are appropriate before submitting.
                        </p>
                    </div>
                </div>

                <div className="w-full max-w-3xl">
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={control}
                                name="recipient"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Recipient</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Recipient's name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Message</FormLabel>
                                        <FormControl>
                                            <textarea
                                                placeholder="Your message"
                                                className="h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="song"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Song</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Song title"
                                                className='h-10'
                                                {...field}
                                                value={field.value || selectedSongDiv ? field.value || songName : ''}
                                                onChange={(e) => {
                                                    field.onChange(e)
                                                    debounced(e.target.value)
                                                }}
                                            />
                                        </FormControl>
                                        {selectedSongDiv && (
                                            <div className="mt-2">
                                                {selectedSongDiv}
                                            </div>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div>
                                {afterSelection && songList.length > 0 && songList.map((song: Song, index: number) => (
                                    <div
                                        key={index}
                                        className="bg-gray-100 flex justify-start gap-2 items-center p-2 border-b cursor-pointer hover:bg-gray-200"
                                        onClick={() => {
                                            selectSong(song, index)
                                            setafterSelection(false)
                                        }}
                                    >
                                        <Image
                                            src={song.album.images[2]?.url}
                                            alt={song.name}
                                            width={40}
                                            height={40}
                                            className="rounded"
                                        />
                                        <h3>{song.name}</h3>
                                    </div>
                                ))}
                            </div>

                            <Button type="submit" disabled={isSubmitting} className="w-full bg-[#F24463]">
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Please wait
                                    </>
                                ) : (
                                    'Send'
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default Submit