import React from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'

type Props = {
    label: string
    className?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export default function LabeledInput({label, className, ...props}: Props) {
  return (
    <div className={className}>
        <Label htmlFor="quiz-name-input" className='mb-2 block'>{label}</Label>
        <Input id='quiz-name-input' {...props} />
    </div>
  )
}
