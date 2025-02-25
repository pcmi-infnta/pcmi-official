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
        clearTimeout(scrollTimeout);
      }
    };
  }, [handleScroll, scrollTimeout]);

  return (
    <div
      className={`${className} transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {children}
    </div>
  );
}