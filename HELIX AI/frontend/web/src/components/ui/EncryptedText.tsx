import React, { useState, useEffect, useCallback } from 'react';

interface EncryptedTextProps {
   text: string;
   encryptedClassName?: string;
   revealedClassName?: string;
   revealDelayMs?: number;
   intervalMs?: number;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

export const EncryptedText: React.FC<EncryptedTextProps> = ({
   text,
   encryptedClassName = "text-neutral-500",
   revealedClassName = "text-white",
   revealDelayMs = 50,
   intervalMs = 40,
}) => {
   const [displayText, setDisplayText] = useState('');
   const [isRevealing, setIsRevealing] = useState(false);

   const scramble = useCallback(() => {
      let iteration = 0;
      const interval = setInterval(() => {
         setDisplayText((prev) =>
            text
               .split("")
               .map((char, index) => {
                  if (index < iteration) {
                     return text[index];
                  }
                  return CHARS[Math.floor(Math.random() * CHARS.length)];
               })
               .join("")
         );

         if (iteration >= text.length) {
            clearInterval(interval);
         }

         iteration += 1 / 3; // Adjust speed
      }, intervalMs);

      return () => clearInterval(interval);
   }, [text, intervalMs]);

   useEffect(() => {
      const timeout = setTimeout(() => {
         setIsRevealing(true);
         scramble();
      }, revealDelayMs);

      return () => clearTimeout(timeout);
   }, [revealDelayMs, scramble]);

   return (
      <span className={isRevealing ? revealedClassName : encryptedClassName}>
         {displayText || text.split('').map(() => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')}
      </span>
   );
};
