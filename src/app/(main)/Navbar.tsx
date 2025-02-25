"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import SearchField from "@/components/SearchField";
import UserButton from "@/components/UserButton";
import Link from "next/link";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const pathname = usePathname();
  
  const isMainFeed = pathname === "/" || pathname === "/home";

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    
    if (isMainFeed) {
      if (currentScrollY < lastScrollY) {
        setIsVisible(true);
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
    
    scrollTimeout.current = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
  }, [lastScrollY, isMainFeed]);

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
      setIsVisible(true);
    }
  }, [handleScroll, isMainFeed]);

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
