import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './Layout';
import { LandingPage } from '../pages/Landing/LandingPage';
import { Dashboard } from '../pages/Dashboard/DashboardPage';
import { ChatbotPage } from '../pages/Chat/ChatPage';
import { ReminderPage } from '../pages/Reminders/ReminderPage';
import { AnalyticsDashboard } from '../pages/Analytics/AnalyticsDashboard';
import SlidingAuthPage from '../pages/Auth/SlidingAuthPage';
import HelpSupportPage from '../pages/Support/HelpSupportPage';
import { JournalPage } from '../pages/Journal/JournalPage';
import { ProfilePage } from '../pages/Profile/ProfilePage';
import { EmergencyContactsPage } from '../pages/Emergency/EmergencyContactsPage';
import { SafetyPlanPage } from '../pages/Safety/SafetyPlanPage';
import SettingsPage from '../pages/Settings/SettingsPage';

export const AppRoutes: React.FC = () => {
   return (
      <Routes>
         <Route path="/" element={<Navigate to="/login" replace />} />

         {/* Auth Routes */}
         <Route path="/login" element={<SlidingAuthPage />} />
         <Route path="/register" element={<SlidingAuthPage />} />
         <Route path="/help" element={<HelpSupportPage />} />

         {/* Protected/App Routes */}
         <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<ChatbotPage />} />
            <Route path="/calendar" element={<ReminderPage />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/emergency-contacts" element={<EmergencyContactsPage />} />
            <Route path="/safety-plan" element={<SafetyPlanPage />} />
            <Route path="/settings" element={<SettingsPage />} />
         </Route>

         <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
   );
};
