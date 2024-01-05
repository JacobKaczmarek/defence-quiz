"use client"

import { trpc } from "@/app/_trpc/client";
import Leaderboard from "@/components/Leaderboard";
import Paginator from "@/components/Paginator";
import Image from "next/image";
import { useState } from "react";

export default function Quiz() {
    const [position, setPosition] = useState<number[]>();
    const getLeaderboard = trpc.getLeaderboard.useQuery();

    const handleImageClick = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setPosition([x, y]);
    }

    return (
        <div className="flex h-full gap-4">
            <div className="flex-1">
                <div className="relative h-full w-full max-h-[80vh] mx-auto">
                    <Image src="/images/nullacht.png" alt="Game situation photo" fill sizes="100vw" className="rounded-sm object-cover w-full h-auto cursor-pointer" onClick={handleImageClick} />

                    <div className="absolute top-[675px] left-[545px] w-[35px] h-[35px] -translate-x-1/2 -translate-y-1/2 rounded-full border-primary border-4"></div>
                    {position && <div style={{ left: position[0], top: position[1]}} className="absolute w-[35px] h-[35px] -translate-x-1/2 -translate-y-1/2 rounded-full border-secondary border-4 pointer-events-none"></div>}
                </div>
                <Paginator className="mt-4"/>
            </div>
            <Leaderboard scores={getLeaderboard.data} />
        </div>
    )
}