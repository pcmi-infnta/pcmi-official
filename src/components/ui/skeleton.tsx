import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        // Base styles
        "relative overflow-hidden rounded-md",
        
        // Better colors for both modes
        "bg-slate-200/70 dark:bg-slate-700/40",
        
        // Add subtle shadow for depth
        "shadow-sm",
        
        // Enhanced animation - shimmer effect
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:animate-[shimmer_2s_infinite]",
        "before:bg-gradient-to-r",
        "before:from-transparent before:via-white/10 before:to-transparent",
        
        // Subtle pulse animation
        "animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]",
        
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }