"use client"

import { FileInput } from '@/components/FileInput'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'
import { compressImage, readURL } from '@/lib/utils'
import Image from 'next/image'

import LabeledInput from '@/components/LabeledInput'
import { Button } from '@/components/ui/button'
import Marker from '@/components/Marker'
import { Question } from '@/lib/types'
import { Loader2, Shield, Sword, Upload } from 'lucide-react'
import QuestionList from '@/components/QuestionList'
import { trpc } from '@/app/_trpc/client'
import { useSession } from "next-auth/react"
import { TCreateQuizDTO } from '@/server/quiz'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'


export default function CreateQuizPage() {
    const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null)
    const [mode, setMode] = useState(1)
    const [name, setName] = useState<string>()
    const [isLoading, setIsLoading] = useState(false)
    const [questions, setQuestions] = useState<(Question & { imageFile?: File, image?: string })[]>([])
    const createQuiz = trpc.quiz.create.useMutation()
    const { data: session } = useSession()
    const router = useRouter()
    const { toast } = useToast()


    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return

        const tmpQuestions = await Promise.all(Array.from(e.target.files).map(async (file) => ({
            image: await readURL(file),
            imageFile: file,
            offensiveX: null,
            offensiveY: null,
            defensiveX: null,
            defensiveY: null,
        } as Question & { image: string, imageFile: File })))

        setQuestions([...questions, ...tmpQuestions])

        e.target.value = ''
    }

    const handleQuestionSelect = async (i: number) => {
        if (!questions || i < 0 || i >= questions.length) return
        setSelectedQuestion(i)
        setMode(1)
    }

    const removeQuestion = async (i: number) => {
        if (!questions || i < 0 || i >= questions.length) return

        setSelectedQuestion(0)
        setQuestions([...questions.slice(0, i), ...questions.slice(i + 1)])
    }

    const handlePositionChange = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!questions || selectedQuestion === null) return

        const rect = e.currentTarget.getBoundingClientRect();
        const x = +((e.clientX - rect.left) / rect.width * 100).toFixed(1);
        const y = +((e.clientY - rect.top) / rect.height * 100).toFixed(1);

        if (mode === 1) {
            const question = questions[selectedQuestion]
            question.offensiveX = x
            question.offensiveY = y
            setQuestions([...questions.slice(0, selectedQuestion), question, ...questions.slice(selectedQuestion + 1)])
        } else if (mode === 2) {
            const question = questions[selectedQuestion]
            question.defensiveX = x
            question.defensiveY = y
            setQuestions([...questions.slice(0, selectedQuestion), question, ...questions.slice(selectedQuestion + 1)])
        }
    }

    const handleSave = async () => {
        if (!validateQuiz()) return
        setIsLoading(true)

        let tmpQuestions = [...questions]
        for (const question of tmpQuestions) {
            if (!question.imageFile) continue
            const compressedFile = await compressImage(question.imageFile);

            const response = await fetch('/api/images', {
                method: 'POST',
                body: compressedFile,
                headers: {
                    'Content-Type': question.imageFile.type,
                },
            });

            if (response.ok) {
                const responseData = await response.json();
                question.imageUrl = responseData.url;
            }
        }

        tmpQuestions = tmpQuestions.map((question) => ({
            imageUrl: question.imageUrl,
            offensiveX: question.offensiveX,
            offensiveY: question.defensiveY,
            defensiveX: question.defensiveX,
            defensiveY: question.defensiveY,
        } as Question))

        createQuiz.mutate({name: name as string, userId: session?.user.id, questions: tmpQuestions} as TCreateQuizDTO, 
            {
                onSuccess: () => {
                    toast({
                        description: "Quiz został dodany",
                      })
                    setIsLoading(false)
                    router.push('/quiz/list')
                }
            })
    }

    const validateQuiz = () => {
        if (!name) return false
        if (questions.length < 1) return false
        if (questions.some((question) => !question.offensiveX || !question.offensiveY || !question.defensiveX || !question.defensiveY)) return false

        return true
    }

    return (
        <div className='flex gap-4 h-full'>
            <div className='w-1/4 flex flex-col'>
                <h1 className='text-2xl font-bold mb-8'>Nowy Quiz</h1>

                <LabeledInput label="Nazwa quizu" className='mb-6' value={name} onChange={(e) => setName(e.target.value)} />

                <Label htmlFor="files-input" className='mb-2 block cursor-pointer'>Zdjęcia</Label>
                <FileInput id="files-input" className="cursor-pointer" multiple accept="image/png, image/gif, image/jpeg" onInput={handleImageUpload} />

                <Separator className='my-6' />

                <QuestionList questions={questions} selectedQuestion={selectedQuestion} handleQuestionSelect={handleQuestionSelect} removeQuestion={removeQuestion} />

                <Button className='my-4' onClick={handleSave} disabled={!validateQuiz() || isLoading}>
                    Zapisz quiz
                    { isLoading ? <Loader2 className='ml-2 animate-spin'/> : <Upload className='ml-2' />}
                </Button>
            </div>

            <Separator orientation='vertical' />

            <div className="w-3/4 h-full">
                <div className="flex mb-4">
                    <Button variant={mode == 1 ? 'default' : 'secondary'} onClick={() => setMode(1)} className='mr-2'>Wybierz zawodnika ofensywnego <Sword className='ml-2'/></Button>
                    <Button variant={mode == 2 ? 'default' : 'secondary'} onClick={() => setMode(2)}>Wybierz pozycje obrońcy <Shield className='ml-2' /></Button>
                </div>

                <div className='relative w-full pb-[56.25%]'>
                    {questions?.length && selectedQuestion !== null && selectedQuestion < questions.length ?
                        <Image
                            src={questions[selectedQuestion]?.image ?? ''}
                            alt="Game situation photo"
                            fill
                            sizes="100vw"
                            className="rounded-sm object-contain cursor-crosshair"
                            onClick={handlePositionChange}
                        /> :
                        <div className='w-full'>
                            <h3 className='text-xl font-semibold text-center mt-20'>Wybierz zdjęcia, które chcesz wykorzystać w quizie</h3>
                        </div>
                    }

                    {selectedQuestion !== null &&
                        selectedQuestion < questions.length &&
                        questions[selectedQuestion].offensiveX != null && questions[selectedQuestion].offensiveY != null &&
                        <Marker position={[questions[selectedQuestion].offensiveX as number, questions[selectedQuestion].offensiveY as number]} color='primary' />
                    }

                    {selectedQuestion !== null &&
                        selectedQuestion < questions.length &&
                        questions[selectedQuestion].defensiveX != null &&
                        questions[selectedQuestion].defensiveY != null &&
                        <Marker position={[questions[selectedQuestion].defensiveX as number, questions[selectedQuestion].defensiveY as number]} color='tertiary' />
                    }
                </div>
            </div>
        </div>
    )
}
