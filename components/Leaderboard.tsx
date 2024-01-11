"use client"

import { Trophy } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { useSession } from "next-auth/react";

type Props = {
    submissions?: Prisma.SubmissionGetPayload<{include: {user: true}}>[]
    className?: string
}

export default function Leaderboard({ submissions, className }: Props) {
    const { data: session } = useSession()

    return (
        <Card className={cn(className, 'min-w-[300px]')}>
            <CardHeader>
                <CardTitle><div className="flex">Leaderboard <Trophy className="ml-2 text-primary"/></div></CardTitle>
            </CardHeader>

            <CardContent>
                {submissions?.toSorted((a, b) => a.score - b.score, ).map((submission, i) => (
                    <div className="my-2 flex items-center" key={submission.id}>
                        <p className="mr-2">{i+1}.</p>

                        <div className={cn(submission.user.id === session?.user.id && 'text-primary', 'flex justify-between items-center flex-1')}>
                            <p className="font-medium leading-none">{submission.user.name}</p>
                            <p className="text-sm text-muted-foreground">{submission.score}</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}