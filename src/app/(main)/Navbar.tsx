"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import SearchField from "@/components/SearchField";
import UserButton from "@/components/UserButton";
import Link from "next/link";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isTouching, setIsTouching] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const pathname = usePathname();
  
  const isMainFeed = pathname === "/" || pathname === "/home";
  const isMessagesPage = pathname === "/messages" || pathname.startsWith("/messages/");

  // Define all hooks unconditionally
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
    
    if (isMainFeed) {
      if (currentScrollY < lastScrollY) {
        if (!isTouching) {
          setIsVisible(true);
        }
      } else if (currentScrollY > 50) {
        setIsVisible(false);
      }
    } else {
      setIsVisible(true);
    }
    
    setLastScrollY(currentScrollY);
    
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    
    if (!isTouching) {
      scrollTimeout.current = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
    }
  }, [lastScrollY, isMainFeed, isTouching]);

  useEffect(() => {
    // Only add event listeners if not on messages page and on main feed
    if (isMainFeed && !isMessagesPage) {
      window.addEventListener("scroll", handleScroll);
      window.addEventListener("touchstart", handleTouchStart);
      window.addEventListener("touchend", handleTouchEnd);
      
      return () => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("touchstart", handleTouchStart);
        window.removeEventListener("touchend", handleTouchEnd);
        const currentTimeout = scrollTimeout.current;
        if (currentTimeout) {
          clearTimeout(currentTimeout);
        }
      };
    } else {
      setIsVisible(true);
      return undefined;
    }
  }, [handleScroll, handleTouchStart, handleTouchEnd, isMainFeed, isMessagesPage]);

  // Early return after all hooks are defined
  if (isMessagesPage) {
    return null;
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`} >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-3">
        <Link href="/" className="text-2xl font-bold text-primary">
          𝗽𝗰𝗺𝗶  
        </Link>
        <div className="flex-grow max-w-lg">
          <SearchField />
        </div>
        <UserButton className="flex-shrink-0" />
      </div>
    </header>
  );
}