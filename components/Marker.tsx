import { cn } from '@/lib/utils'
import { VariantProps, cva } from 'class-variance-authority'
import React from 'react'

const button = cva('absolute w-[15px] h-[15px] md:w-[25px] md:h-[25px] lg:w-[35px] lg:h-[35px] -translate-x-1/2 -translate-y-1/2 rounded-full border-primary border-4 pointer-events-none', {
    variants: {
        color: {
            primary: 'border-primary',
            secondary: 'border-secondary',
            tertiary: 'border-tertiary',
        },
    }
})

type Props = {
    position: [number, number],
    className?: string,
} & VariantProps<typeof button>

export default function Marker({ position, className, color }: Props) {
  return (
    <div style={{ top: `${position[1]}%`, left: `${position[0]}%` }} className={cn(className, button({color}))}></div>
  )
}
