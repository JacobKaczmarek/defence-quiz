import { Question } from '@prisma/client'
import Image from 'next/image'
import React from 'react'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination'
import Marker from './Marker'

type Props = {
  questions: Question[]
}

export default function QuestionsPreview({ questions }: Props) {
  const [selectedQuestion, setSelectedQuestion] = React.useState<number>(0)

  return (
    <div>
      <div className='w-full pb-[56.25%] relative'>
        <Image src={questions[selectedQuestion].imageUrl} fill className='object-contain' alt='img' />
        <Marker position={[questions[selectedQuestion].offensiveX, questions[selectedQuestion].offensiveY]} />
        <Marker position={[questions[selectedQuestion].defensiveX, questions[selectedQuestion].defensiveY]} color='tertiary' />
      </div>

      <Pagination className='mt-4'>
        <PaginationContent>

          <PaginationItem>
            <PaginationPrevious onClick={() => selectedQuestion !== 0 && setSelectedQuestion(selectedQuestion - 1)} />
          </PaginationItem>

          {questions.map((_, i) => (
            <PaginationItem
              key={i}
              onClick={() => setSelectedQuestion(i)}
            >
              <PaginationLink isActive={selectedQuestion === i}>{i + 1}</PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext onClick={() => selectedQuestion !== questions.length - 1 && setSelectedQuestion(selectedQuestion + 1)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
