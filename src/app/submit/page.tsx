"use client"

import { CircleAlert, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form"
// import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import axios from 'axios'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useDebounceCallback } from 'usehooks-ts'
import Image from 'next/image';

interface FormData {
    recipient: string;
    message: string;
    song: string;
}

interface Song {
    external_urls: {
        spotify: string;
    };
    name: string;
    album: {
        images: { url: string }[];
    };
}


const Submit: React.FC = () => {
    // const { toast } = useToast()
    const router = useRouter()
    const form = useForm<FormData>()
    const { handleSubmit, control } = form
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [afterSelection, setafterSelection] = useState(true)
    const [songName, setSongname] = useState('');
    // const [selectedSongName, setSelectedSongName] = useState('');
    const [selectedSongUrl, setSelectedSongUrl] = useState('');
    // const [songList, setSongList] = useState('')
    const [songList, setSongList] = useState<Song[]>([]);
    const [selectedSongDiv, setSelectedSongDiv] = useState<React.ReactNode | null>(null);


    const accessTokenUrl = process.env.NEXT_PUBLIC_SPOTIFY_ACCESSTOKEN_URL;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const [accessToken, setAccessToken] = useState('');

    //use debounce for getting response after 300ms
    const debounced = useDebounceCallback((value: string) => {
        setafterSelection(true)
        setSongname(value)
    }, 1000)


    const selectSong = (song: Song, index: number) => {
        // Create the song div
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
        );

        // Set the selected song div
        setSelectedSongDiv(songDiv);
        // setSelectedSongName(song.name)
        // Set the song name in the form
        // setValue('song', song.name);
        setSelectedSongUrl(song?.external_urls?.spotify)
    }

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true)

        try {
            await axios.post(`${backendUrl}/message`, {
                recipient: data.recipient,
                message: data.message,
                songurl: selectedSongUrl

            });

            router.replace('/history')
        } catch (error) {
            console.error("error in sending message", error)

        } finally {
            setIsSubmitting(false)
        }
        // console.log(selectedSongUrl, data)

    }

    useEffect(() => {
        const getFreshAccessToken = async () => {
            setIsSubmitting(true);
            try {
                const response = await axios.get(
                    `${accessTokenUrl}`);
                setAccessToken(response?.data?.[0].token)
                // console.log(response?.data?.[0].token)
            } catch (error) {
                console.error(error);
            } finally {
                setIsSubmitting(false);
            }
        }
        getFreshAccessToken()
    }, [accessTokenUrl]);

    useEffect(() => {
        const getSongs = async () => {
            if (!songName) return;
            setIsSubmitting(true);
            try {
                const response = await axios.get(
                    `https://api.spotify.com/v1/search?q=${songName}&type=track&limit=5`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                setSongList(response.data.tracks.items);
            } catch (error) {
                console.error(error);
            } finally {
                setIsSubmitting(false);
            }
        };

        getSongs();
    }, [songName, accessToken]);

    return (
        <div className="mt-10 flex flex-col items-center justify-center mb-10 mx-8">
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
                                        <Input placeholder="Recipient's name" {...field}
                                        />
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
                                        <textarea placeholder="Your message" className="h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* <FormField
                            control={control}
                            name="song"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Song</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Song title" className='h-10' {...field}
                                            onChange={(e) => {
                                                field.onChange(e)
                                                debounced(e.target.value)
                                            }} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}
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
                        {/* <div>
                            {afterSelection && {songList.length > 0 &&
                                songList.map((song: Song, index: number) => (
                                    <div
                                        key={index}
                                        className='bg-gray-100 flex justify-start gap-2 items-center p-2 border-b cursor-pointer hover:bg-gray-200'
                                        onClick={() => selectSong(song); setafterSelection(!afterSelection) }
                                    >
                                        <img
                                            src={song.album.images[2]?.url}
                                            alt={song.name}
                                            width={40}
                                            height={20}
                                            className='rounded'
                                        />
                                        <h3>{song.name}</h3>
                                    </div>
                                ))}}
                        </div> */}
                        <div>
                            {afterSelection &&
                                songList.length > 0 &&
                                songList.map((song: Song, index: number) => (
                                    <div
                                        key={index}
                                        className="bg-gray-100 flex justify-start gap-2 items-center p-2 border-b cursor-pointer hover:bg-gray-200"
                                        onClick={() => {
                                            selectSong(song, index);
                                            setafterSelection(false);
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
    );
};

export default Submit;