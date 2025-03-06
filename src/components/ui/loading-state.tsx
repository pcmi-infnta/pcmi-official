import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

export function LoadingState({ 
  message = "Loading...", 
  size = "md",
  fullScreen = false
}: LoadingStateProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };

  return (
    <div className={cn(
  "flex flex-col items-center justify-center gap-3 w-full px-4",
  fullScreen ? "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" : "py-8"
)}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}