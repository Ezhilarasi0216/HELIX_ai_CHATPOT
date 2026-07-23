import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, HeartHandshake } from 'lucide-react';
import { apiService } from '../../services/api';

export const RegisterPage: React.FC = () => {
   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const navigate = useNavigate();

   const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      try {
         await apiService.register(email, password, name);
         navigate('/login');
      } catch (err: any) {
         setError(err.message || 'Registration failed');
      }
   };

   return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden" style={{ fontFamily: 'Outfit, sans-serif' }}>
         {/* Background Glow Effects */}
         <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/40 via-purple-300/40 to-green-200/40 rounded-full blur-[100px] animate-pulse" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-bl from-yellow-200/30 via-pink-200/30 to-orange-100/30 rounded-full blur-[120px]" />

         <div className="bg-white p-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-full max-w-md border-2 border-black animate-slide-down relative z-10">
            <div className="flex flex-col items-center justify-center gap-2 mb-8">
               <div className="p-3 bg-black rounded-2xl mb-2 -rotate-3 hover:rotate-0 transition-transform cursor-pointer">
                  <HeartHandshake className="text-white w-8 h-8" />
               </div>
               <h1 className="text-4xl font-black text-black tracking-tight mb-1 uppercase">Join Us</h1>
               <p className="text-black font-bold">Create your Healix AI account</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
               {error && (
                  <div className="bg-red-50 border-2 border-red-500 p-3 rounded-xl text-red-600 text-sm font-bold text-center">
                     {error}
                  </div>
               )}
               <div className="space-y-2">
                  <label className="text-sm font-bold text-black uppercase tracking-wider ml-1">Full Name</label>
                  <div className="relative group">
                     <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40 group-focus-within:text-black transition-colors" />
                     <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/50 border-2 border-black/5 rounded-2xl focus:outline-none focus:border-black transition-all text-black placeholder:text-black/30 font-semibold text-lg"
                        placeholder="John Doe"
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-sm font-bold text-black uppercase tracking-wider ml-1">Email Address</label>
                  <div className="relative group">
                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40 group-focus-within:text-black transition-colors" />
                     <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/50 border-2 border-black/5 rounded-2xl focus:outline-none focus:border-black transition-all text-black placeholder:text-black/30 font-semibold text-lg"
                        placeholder="you@example.com"
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-sm font-bold text-black uppercase tracking-wider ml-1">Password</label>
                  <div className="relative group">
                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40 group-focus-within:text-black transition-colors" />
                     <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/50 border-2 border-black/5 rounded-2xl focus:outline-none focus:border-black transition-all text-black placeholder:text-black/30 font-semibold text-lg"
                        placeholder="••••••••"
                     />
                  </div>
               </div>

               <button
                  type="submit"
                  className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-slate-900 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl flex items-center justify-center gap-3 group mt-4"
               >
                  Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </button>
            </form>

            <div className="mt-10 text-center text-sm">
               <span className="text-black font-bold italic">Already have an account?</span>{' '}
               <Link to="/login" className="text-black font-black hover:underline uppercase tracking-tighter ml-1 text-base">
                  Sign In
               </Link>
            </div>
         </div>
      </div>
   );
};
