import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Calendar as CalendarIcon } from 'lucide-react';
import { Sidebar } from '../pages/Chat/components/Sidebar/Sidebar';
import { EmergencySOSModal } from '../pages/Chat/components/Chat/EmergencySOSModal';
import { WakeWordListener } from '../components/common/WakeWordListener';
import { useEmotion } from '../context/EmotionContext';
import { sendNotification } from '../utils/notification';

export const Layout: React.FC = () => {
   const location = useLocation();
   const navigate = useNavigate();
   const { resetChat, isSOSOpen, setIsSOSOpen, isTamilMode, setIsTamilMode } = useEmotion();

   const handleNewChat = () => {
      resetChat();
      navigate('/chat');
   };

   useEffect(() => {
      const checkReminders = () => {
         const saved = localStorage.getItem('mindfulness_reminders');
         if (!saved) return;

         const reminders = JSON.parse(saved);
         const now = new Date();
         const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

         const sentTodayKey = `sent_reminders_${now.toDateString()}`;
         const sentToday = JSON.parse(localStorage.getItem(sentTodayKey) || '[]');

         reminders.forEach((r: any) => {
            if (r.enabled && r.time === currentTime && !sentToday.includes(r.id)) {
               const user = JSON.parse(localStorage.getItem('user') || '{}');
               const firstName = (user.full_name || 'there').split(' ')[0];

               sendNotification(
                  "Time for a Check-in! 🔔",
                  `Hi ${firstName}, how are you feeling right now? Let's chat for a moment.`
               );

               sentToday.push(r.id);
               localStorage.setItem(sentTodayKey, JSON.stringify(sentToday));
            }
         });
      };

      const interval = setInterval(checkReminders, 60000);
      checkReminders();

      return () => clearInterval(interval);
   }, []);

   return (
      <div className="flex h-screen bg-white overflow-hidden">
         {!['/analytics', '/journal'].includes(location.pathname) && (
            <Sidebar
               onNewChat={handleNewChat}
               onTriggerSOS={() => setIsSOSOpen(true)}
               isTamilMode={isTamilMode}
               onLanguageToggle={(lang) => setIsTamilMode(lang === 'TA')}
               onChatSelect={() => { }}
               currentSessionId={null}
            />
         )}

         <WakeWordListener />

         {/* Main Content */}
         <div className="flex-1 flex flex-col h-full overflow-auto relative">
            <Outlet />
         </div>

         <EmergencySOSModal
            isOpen={isSOSOpen}
            onClose={() => setIsSOSOpen(false)}
            emergencyContact={JSON.parse(localStorage.getItem('user') || '{}').emergency_contact}
         />
      </div>
   );
};
