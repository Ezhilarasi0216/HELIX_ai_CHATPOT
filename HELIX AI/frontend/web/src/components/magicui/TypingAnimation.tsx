"use client";

import { useEffect, useState } from "react";
import { cn } from "../../utils/cn";

interface TypingAnimationProps {
   children: string;
   className?: string;
   duration?: number;
   delay?: number;
   startOnView?: boolean;
}

export function TypingAnimation({
   children,
   className,
   duration = 50,
   delay = 0,
}: TypingAnimationProps) {
   const [displayedText, setDisplayedText] = useState<string>("");
   const [i, setI] = useState<number>(0);

   useEffect(() => {
      const startTimeout = setTimeout(() => {
         const typingEffect = setInterval(() => {
            if (i < children.length) {
               setDisplayedText((prevState) => prevState + children.charAt(i));
               setI(i + 1);
            } else {
               clearInterval(typingEffect);
            }
         }, duration);

         return () => {
            clearInterval(typingEffect);
         };
      }, delay);

      return () => clearTimeout(startTimeout);
   }, [children, duration, i, delay]);

   return (
      <span
         className={cn(
            "font-display tracking-[-0.02em]",
            className,
         )}
      >
         {displayedText}
      </span>
   );
}
