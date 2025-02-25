"use client";

import { useEffect, useState, useCallback } from "react";

interface MobileMenuBarProps {
  children: React.ReactNode;
  className?: string;
}

export default function MobileMenuBar({ children, className }: MobileMenuBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);

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
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [handleScroll, scrollTimeout]);

  return (
  <div
    className={`fixed bottom-0 left-0 z-50 w-full bg-background/80 backdrop-blur-sm ${
      isVisible ? "translate-y-0" : "translate-y-full"
    } ${className}`} >
    {children}
  </div>
);
}