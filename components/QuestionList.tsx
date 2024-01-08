import { Question } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Check, Trash } from 'lucide-react'
import React from 'react'

type Props = {
    questions: Question[]
    selectedQuestion: number | null
    handleQuestionSelect: (index: number) => void
    removeQuestion: (index: number) => void
}

export default function QuestionList({ questions, selectedQuestion, handleQuestionSelect, removeQuestion }: Props) {
  return (
    <div className='flex flex-col flex-1 gap-y-2 overflow-scroll'>
        {questions && questions.map((question, i) => (
            <div
                key={i}
                className={cn('flex justify-between rounded-sm border border-secondary p-2 cursor-pointer', selectedQuestion == i ? 'bg-primary text-white' : '')}
                onClick={() => handleQuestionSelect(i)}
            >
                <span className='font-semibold mr-2'>{i + 1}.</span>
                <div className='flex'>
                    { question.offensiveX && question.offensiveY && question.defensiveX && question.defensiveY && <Check className='text-green-400 mr-2' />}
                    <Trash className='text-red-400' onClick={() => removeQuestion(i)}/>
                </div>
            </div>
        ))}
    </div>
  )
}
