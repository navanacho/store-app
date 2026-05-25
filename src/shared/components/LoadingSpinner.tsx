import { LoaderCircle } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: number
}

export function LoadingSpinner({ size = 32 }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <LoaderCircle
        className="animate-spin text-rb-red"
        size={size}
      />
    </div>
  )
}
