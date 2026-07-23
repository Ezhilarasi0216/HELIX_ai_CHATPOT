import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, Bot } from 'lucide-react';
import CustomButton from '../../components/CustomButton';
import { RetroGrid } from '../../components/magicui/RetroGrid';

export const LandingPage: React.FC = () => {
   const [textIndex, setTextIndex] = useState(0);
   const textOptions = ["Anxiety", "Stress", "Growth", "Clarity"];

   useEffect(() => {
      const interval = setInterval(() => {
         setTextIndex((prev) => (prev + 1) % textOptions.length);
      }, 2000);
      return () => clearInterval(interval);
   }, []);

   return (
      <div className="min-h-screen bg-white text-slate-900 relative overflow-hidden flex flex-col items-center justify-center">
         {/* Retro Grid Background */}
         <RetroGrid />

         {/* Navbar */}
         <div className="absolute top-0 right-0 p-8 flex items-center gap-6 z-20">
            <Link to="/login" className="text-slate-300 hover:text-white font-medium transition-colors tracking-wide">
               Login
            </Link>
            <Link to="/register" className="text-slate-300 hover:text-white font-medium transition-colors tracking-wide">
               Sign Up
            </Link>
         </div>

         <div className="container mx-auto px-6 py-20 flex flex-col items-center text-center relative z-10">

            {/* Hero Text */}
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-tight animate-fade-in">
               Your AI Companion for <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffd319] via-[#ff2975] to-[#8c1eff]">
                  {textOptions[textIndex]}
               </span>
            </h1>

            <p className="text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed animate-fade-in [animation-delay:0.2s]">
               Healix AI listens, understands, and grows with you. A safe space to explore your emotions 24/7.
            </p>

            <Link to="/login">
               <CustomButton text="Chat with Helix" />
            </Link>



         </div>
      </div>
   );
};
