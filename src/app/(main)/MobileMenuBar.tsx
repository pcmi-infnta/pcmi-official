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
  
  const pathname = usePathname();
  
  const isMainFeed = pathname === "/" || pathname === "/home";
  const isMessagesPage = pathname === "/messages" || pathname.startsWith("/messages/");
  
  const handleTouchStart = useCallback(() => {
    setIsTouching(true);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsTouching(false);
    
    if (window.scrollY < lastScrollY) {
      setIsVisible(true);
    }
  }, [lastScrollY]);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY < lastScrollY) {
      if (!isTouching) {
        setIsVisible(true);
      }
    } else {
      setIsVisible(false);
    }
    
    setLastScrollY(currentScrollY);
  }, [lastScrollY, isTouching]);  

  useEffect(() => {
    if (isMainFeed && !isMessagesPage) {
      window.addEventListener("scroll", handleScroll);
      window.addEventListener("touchstart", handleTouchStart);
      window.addEventListener("touchend", handleTouchEnd);
      
      const currentTimeout = scrollTimeout.current;
      
      return () => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("touchstart", handleTouchStart);
        window.removeEventListener("touchend", handleTouchEnd);
        if (currentTimeout) {
          clearTimeout(currentTimeout);
        }
      };
    } else {
      setIsVisible(true);
      return undefined;
    }
  }, [handleScroll, handleTouchStart, handleTouchEnd, isMainFeed, isMessagesPage]);

  if (isMessagesPage) {
    return null;
  }

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