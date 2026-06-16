import { cn } from '@/lib/utils'
import { ICONS } from '@/utils/iconsMap'

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
} as const

interface MapIconProps {
  name: string
  size?: keyof typeof sizeClasses
  color?: string
  className?: string
  showBackground?: boolean
}

export function MapIcon({
  name,
  size = 'md',
  color,
  className,
  showBackground = false,
}: MapIconProps) {
  const Icon = ICONS[name]

  if (!Icon) {
    return (
      <span
        className={cn(
          sizeClasses[size],
          'inline-flex items-center justify-center rounded-md bg-app-muted text-[9px] font-mono text-app-muted-fg uppercase shrink-0',
          className
        )}
      >
        {name.slice(0, 2)}
      </span>
    )
  }

  return (
    <span
      className={cn(
        sizeClasses[size],
        'inline-flex items-center justify-center shrink-0 rounded-md overflow-hidden',
        showBackground && 'p-0.5',
        className
      )}
      style={{
        ...(color ? { color } : undefined),
        ...(showBackground && color ? { background: `${color}33` } : undefined),
      }}
    >
      <Icon className="w-full h-full" />
    </span>
  )
}
