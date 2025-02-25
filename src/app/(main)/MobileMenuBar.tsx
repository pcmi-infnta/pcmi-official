"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface MobileMenuBarProps {
  children: React.ReactNode;
  className?: string;
}

export default function MobileMenuBar({
  children,
  className = "",
}: MobileMenuBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isTouching, setIsTouching] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Get the current pathname
  const pathname = usePathname();
  
  // Check if we're on the main feed
  const isMainFeed = pathname === "/" || pathname === "/home";
  
  const handleTouchStart = useCallback(() => {
  setIsTouching(true);
}, []);

const handleTouchEnd = useCallback(() => {
  setIsTouching(false);
  
  // Check if we should show the bars after touch release
  if (window.scrollY < lastScrollY) {
    setIsVisible(true);
  }
}, [lastScrollY]);

  const handleScroll = useCallback(() => {
  const currentScrollY = window.scrollY;
  
  if (currentScrollY < lastScrollY) {
    setIsVisible(true);
  } else {
    setIsVisible(false);
  }
  
  setLastScrollY(currentScrollY);
  
}, [lastScrollY]);

  useEffect(() => {
  if (isMainFeed) {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  } else {
    setIsVisible(true);
  }
}, [handleScroll, handleTouchStart, handleTouchEnd, isMainFeed]);

  return (
  <div
    className={`fixed bottom-0 left-0 z-50 w-full bg-background/80 backdrop-blur-sm ${
      isVisible ? "translate-y-0" : "translate-y-full"
    } ${className}`}
  >
    {children}
  </div>
);
}