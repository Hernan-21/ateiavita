"use client";

import { VideoPayload } from "@/types/content";

export function VideoEngine({ data }: { data: VideoPayload }) {
    // Simple ID extraction for YouTube if full URL is pasted
    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : url;
    }

    const videoId = data.provider === 'youtube' ? getYoutubeId(data.url) : data.url;

    if (!videoId) {
        return (
            <div className="aspect-video bg-gray-100 flex items-center justify-center rounded-xl">
                <p className="text-gray-400">No video URL configured</p>
            </div>
        )
    }

    return (
        <div className="aspect-video rounded-xl overflow-hidden shadow-lg bg-black">
            {data.provider === 'youtube' ? (
                <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="Video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                    <p>Support for {data.provider} viewer is coming soon.</p>
                </div>
            )}
        </div>
    )
}
