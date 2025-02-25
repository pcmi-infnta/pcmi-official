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
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Get the current pathname
  const pathname = usePathname();
  
  // Check if we're on the main feed
  const isMainFeed = pathname === "/" || pathname === "/home";

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
      
      return () => {
        window.removeEventListener("scroll", handleScroll);
        if (scrollTimeout.current) {
          clearTimeout(scrollTimeout.current);
        }
      };
    } else {
      // Make sure menu bar is visible on other pages
      setIsVisible(true);
    }
  }, [handleScroll, isMainFeed]);

  return (
    <div
      className={`fixed bottom-0 left-0 z-50 w-full bg-background/80 backdrop-blur-sm ${
        isVisible ? "translate-y-0" : "translate-y-full"
      } transition-transform duration-300 ${className}`}
    >
      {children}
    </div>
  );
}