"use client"

import { trpc } from "@/app/_trpc/client";
import Image from "next/image";
import { useState } from "react";
import Marker from "@/components/Marker";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, ChevronRight, Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import Leaderboard from "@/components/Leaderboard";
import Link from "next/link";
import { cn } from "@/lib/utils";


export default function QuizPage({ params }: { params: { id: string } }) {
    const [position, setPosition] = useState<number[]>();
    const [questionNumber, setQuestionNumber] = useState<number>(0)
    const [score, setScore] = useState<number>()
    const [total, setTotal] = useState<number>(0)
    const [imageLoaded, setImageLoaded] = useState(false)
    const { data: session } = useSession()

    const quiz = trpc.quiz.getQuiz.useQuery({ quizId: params.id })
    const submissionMutation = trpc.quiz.addSubmission.useMutation({
        onSuccess: () => {
            quiz.refetch()
        }
    })

    const handleImageClick = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        if (score !== undefined) return

        const rect = e.currentTarget.getBoundingClientRect();
        const x = +((e.clientX - rect.left) / rect.width * 100).toFixed(2);
        const y = +((e.clientY - rect.top) / rect.height * 100).toFixed(2);

        setPosition([x, y]);
    }

    const submit = async () => {
        if (!quiz.data || position === undefined) return


        const question = quiz.data.questions[questionNumber]

        const distance = Math.sqrt(Math.pow(question.defensiveX - position[0], 2) + Math.pow(question.defensiveY - position[1], 2))

        const score = Math.max(1, distance) ** 2

        setScore(score)
    }

    const nextQuestion = () => {
        if (score === undefined || !quiz.data) return

        if (questionNumber === quiz.data.questions.length - 1) save()
        else {
            setTotal(total + score)    
            setScore(undefined)
            setPosition(undefined)
        }
        setQuestionNumber(questionNumber + 1)
        setImageLoaded(false)
    }

    const save = async () => {
        if (! session?.user.id || total === undefined) return

        submissionMutation.mutate({
            userId: session?.user?.id,
            quizId: params.id,
            score: +(total + (score ?? 0)).toFixed(2),
        })
    }

    return (
        <div className="flex flex-col h-full w-full">
            <h2 className="text-2xl font-bold mb-5">{quiz.data?.name}</h2>
            { quiz.data && (
                questionNumber === quiz.data.questions.length ? (
                    <div className="flex flex-1 items-center justify-center">
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <p className="text-2xl font-bold mb-8">Twój wynik: {(total + (score ?? 0)).toFixed(2)}</p>
                            <Link href="/quiz/list"><Button variant='outline'><ArrowLeft size={18} className="mr-2"/>Powrót</Button></Link>
                        </div>
                        <Leaderboard submissions={quiz.data.submissions as any} className="ml-5 h-full" />
                    </div>
                ) :
                <div>
                    <div className="w-full pb-[56.25%] relative">
                        <Image 
                            src={quiz.data.questions[questionNumber].imageUrl}
                            fill
                            className={cn('object-contain', { 'opacity-0': !imageLoaded })}
                            alt='img'
                            onClick={handleImageClick}
                            onLoadingComplete={() => setImageLoaded(true)}
                        />
                        { !imageLoaded && <Loader className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'/>}
                        { imageLoaded && <Marker position={[quiz.data.questions[questionNumber].offensiveX, quiz.data.questions[questionNumber].offensiveY]} color='primary' /> }
                        { position && <Marker position={position as [number, number]} color='secondary' /> }
                        { score !== undefined && <Marker position={[quiz.data.questions[questionNumber].defensiveX, quiz.data.questions[questionNumber].defensiveY]} color='tertiary' /> }
                    </div>

                    <div className="mt-4 flex justify-between">
                        <Button
                            disabled={position === undefined || score !== undefined}
                            onClick={submit}
                        >
                            Zatwierdź
                            <Check className="ml-2" />
                        </Button>


                        { score !== undefined && <p className="font-semibold">Wynik: {score.toFixed(2)}</p> }
                        
                        <Button
                            className="ml-2"
                            onClick={nextQuestion}
                            disabled={score === undefined}
                            variant='secondary'
                        >
                            Następne pytanie
                            <ChevronRight className="ml-2" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}