"use client"; // Add this line at the top

import { useEffect, useState, useCallback } from "react";
import SearchField from "@/components/SearchField";
import UserButton from "@/components/UserButton";
import Link from "next/link";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true); // State to track visibility
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
        clearTimeout(scrollTimeout); // Clean up timeout on unmount
      }
    };
  }, [handleScroll, scrollTimeout]); // Include 'handleScroll' in the dependency array

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
