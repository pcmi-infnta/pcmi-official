import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface VerifiedBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  tooltipContent?: string;
}

const sizeMap = {
  sm: 14,
  md: 16,
  lg: 20,
};

export default function VerifiedBadge({
  className,
  size = 'md',
  showTooltip = true,
  tooltipContent = "Verified Account"
}: VerifiedBadgeProps) {
  const badgeSize = sizeMap[size];

  const badge = (
    <div className={cn(
      "inline-flex items-center justify-center",
      "transition-all duration-200 ease-in-out",
      "hover:scale-110",
      className
    )}>
      <Image
        src="/verified-badge.svg" // Make sure this image exists in your public folder
        alt="Verified Badge"
        width={badgeSize}
        height={badgeSize}
        className="text-blue-500"
        aria-label="Verified Account Badge"
      />
    </div>
  );

  if (!showTooltip) {
    return badge;
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent 
          className="bg-popover px-3 py-1.5 text-sm text-popover-foreground animate-in fade-in-0 zoom-in-95"
          side="top"
        >
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}