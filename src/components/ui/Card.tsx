import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn("glass rounded-xl p-6 transition-all duration-300 hover:shadow-[0_8px_32px_0_rgba(59,130,246,0.1)]", className)}
      {...props}
    />
  )
}
