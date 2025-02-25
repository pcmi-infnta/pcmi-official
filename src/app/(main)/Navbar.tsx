"use client"; // Add this line at the top

import { useEffect, useState, useCallback } from "react";
import SearchField from "@/components/SearchField";
import UserButton from "@/components/UserButton";
import Link from "next/link";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true); // State to track visibility
  const [lastScrollY, setLastScrollY] = useState(0); // State to track last scroll position
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null); // For managing timeout

  const handleScroll = useCallback(() => {
  const currentScrollY = window.scrollY;

  // Clear any existing timeout
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }

  // Set visibility based on scroll direction - instantly
  if (currentScrollY > lastScrollY) {
    setIsVisible(false); // Hide immediately when scrolling down
  } else {
    setIsVisible(true); // Show immediately when scrolling up
  }

  // Update last scroll position
  setLastScrollY(currentScrollY);
  
  // No timeout needed for hiding
}, [lastScrollY, scrollTimeout]);

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
    <header className={`sticky top-0 z-10 bg-card shadow-sm transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
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
