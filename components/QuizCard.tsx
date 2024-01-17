import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { cn } from '@/lib/utils'
import { Prisma } from '@prisma/client'
import { Crown, HelpCircle, UserCheck } from 'lucide-react'

type Props = {
    quiz: Prisma.QuizGetPayload<{include: { submissions : true, questions: true }}>
    className?: string
    active?: boolean
    onClick?: () => void
}

export default function QuizCard({ quiz, className, active = false, onClick }: Props) {
    const getLowestScore = () => {
        let lowestScore = Infinity

        quiz.submissions.forEach(submission => {
            if (submission.score < lowestScore) lowestScore = submission.score
        })

        return lowestScore
    }

  return (
    <Card
        className={cn(className, 'min-w-[300px] cursor-pointer', active && 'bg-primary text-white :dark-text-primary')}
        onClick={onClick}
    >
        <CardHeader className='flex-row justify-between p-4'>
            <CardTitle className='text-xl capitalize'>{quiz.name}</CardTitle>
            <CardDescription className={cn('flex justify-between', active && 'text-slate-100')}>
                <div className='flex'>
                    {quiz.questions.length}
                    <HelpCircle className='mx-2'size={20} />
                    {quiz.submissions.length}
                    <UserCheck className='mx-2' size={20} />
                </div>
            </CardDescription>
        </CardHeader>
        
        <CardContent className='p-4 pt-2 w-fit ml-auto'>
            {quiz.submissions.length !== 0 ? <span className='flex font-semibold'><Crown className='mr-2' />{getLowestScore()}</span> : <p>Brak wyników</p>}
        </CardContent>
    </Card>
  )
}
