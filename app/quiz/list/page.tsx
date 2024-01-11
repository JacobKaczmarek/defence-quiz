"use client"

import { trpc } from '@/app/_trpc/client';
import Leaderboard from '@/components/Leaderboard';
import QuizCard from '@/components/QuizCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Submission } from '@prisma/client';
import { FilePlus, Rocket } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react';
import QuestionsPreview from '@/components/QuestionsPreviev';

export default function QuizListPage() {
    const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null)
    const [userSubmission, setUserSubmission] = useState<Submission | null>(null)

    const { data: session } = useSession()

    const quizzes = trpc.quiz.getAllQuizzes.useQuery()
    const submissions = trpc.quiz.getSubmissions.useQuery({ quizId: quizzes.data && selectedQuiz ? quizzes.data[selectedQuiz].id : ''}, {
        enabled: selectedQuiz !== null && quizzes.data !== undefined,
    } )

    useEffect(() => {
        if (!session?.user || selectedQuiz === null || !quizzes.data) return

        const submission = quizzes.data[selectedQuiz].submissions.find(submission => submission.userId === session.user.id)

        if (submission) setUserSubmission(submission as any)
        else setUserSubmission(null)
    }, [session, selectedQuiz, quizzes.data])

    return (
        <div className='flex flex-col h-full'>
            <div className='flex justify-between'>
                <h1 className='text-2xl font-bold mb-6'>Wszystkie quizy</h1>

                <Link href="/quiz/create"><Button>Stwórz nowy quiz <FilePlus className="ml-2" /></Button></Link>
            </div>

            <Separator className='my-5' />

            <div className="flex flex-1">
                <div className='h-full overflow-scroll flex flex-col gap-3'>
                    {quizzes.data?.length === 0 ?
                        <p>No quizzes found</p> :
                        quizzes.data?.map((quiz, i) => (
                            <QuizCard quiz={quiz as any} key={quiz.id} active={selectedQuiz === i} onClick={() => setSelectedQuiz(i)} />
                        ))
                    }
                </div>

                <Separator orientation='vertical' className='mx-5' />

                <div className='flex-1'>
                    {selectedQuiz !== null && quizzes.data && <div>
                        <h1 className='text-2xl font-bold mb-6 capitalize'>{quizzes.data[selectedQuiz].name}</h1>
                        {userSubmission ?
                            <QuestionsPreview questions={quizzes.data[selectedQuiz].questions} /> :
                            <div className='w-full mt-[100px] flex flex-col items-center'>
                                <p className='text-center'>
                                    Aby wyświetlić poprawne odpowiedzi rozwiąż quiz.
                                </p>
                                <p className='mb-5'>
                                    <span className='font-semibold mr-1'>Uwaga:</span>Do kadego quizu jest tylko jedno podejście.
                                </p>
                                <Link href={`/quiz/${quizzes.data[selectedQuiz].id}`} className='block w-fit'><Button>Rozpocznij quiz <Rocket className='ml-2' /></Button></Link>
                            </div>
                        }
                    </div>}
                </div>

                <Separator orientation='vertical' className='mx-5' />

                <div>
                    <Leaderboard submissions={submissions.data as any} className="h-full" />
                </div>
            </div>
        </div>

    )
}
