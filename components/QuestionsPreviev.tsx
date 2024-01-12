import { Question } from '@prisma/client'
import Image from 'next/image'
import { use, useEffect, useState } from 'react'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination'
import Marker from './Marker'
import Loader from './Loader'
import { cn } from '@/lib/utils'

type Props = {
  questions: Question[]
}

export default function QuestionsPreview({ questions }: Props) {
  const [selectedQuestion, setSelectedQuestion] = useState<number>(0)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    setImageLoaded(false)
  }, [selectedQuestion])

  return (
    <div>
      <div className='w-full pb-[56.25%] relative'>
        <Image
          src={questions[selectedQuestion].imageUrl}
          fill
          className={cn('object-contain', { 'opacity-0': !imageLoaded })}
          alt='img'
          onLoadingComplete={() => setImageLoaded(true)}
        />
        { !imageLoaded && <Loader className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'/>}
        { imageLoaded && <Marker position={[questions[selectedQuestion].offensiveX, questions[selectedQuestion].offensiveY]} /> }
        { imageLoaded && <Marker position={[questions[selectedQuestion].defensiveX, questions[selectedQuestion].defensiveY]} color='tertiary' /> }
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
