import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Bell, Clock, CheckCircle2, AlertCircle, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { requestNotificationPermission } from '../../utils/notification';

interface ReminderSetting {
   id: string;
   label: string;
   time: string;
   enabled: boolean;
   type: 'daily' | 'scheduled';
   date?: string; // ISO date string for scheduled reminders
}

const DigitalClock: React.FC = () => {
   const [time, setTime] = useState(new Date());

   useEffect(() => {
      const timer = setInterval(() => setTime(new Date()), 1000);
      return () => clearInterval(timer);
   }, []);

   return (
      <ClockContainer>
         <TimeText>
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
         </TimeText>
         <DateText>
            {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
         </DateText>
      </ClockContainer>
   );
};

interface CalendarGridProps {
   selectedDate: Date | null;
   onDateSelect: (date: Date) => void;
   scheduledReminders: ReminderSetting[];
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ selectedDate, onDateSelect, scheduledReminders }) => {
   const [currentMonth, setCurrentMonth] = useState(new Date());

   const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
   const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
   const today = new Date();

   const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
   const blanks = Array.from({ length: firstDay }, (_, i) => i);

   const getRemindersForDay = (day: number) => {
      const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toISOString().split('T')[0];
      return scheduledReminders.filter(r => r.date === dateStr);
   };

   const isPastDate = (day: number) => {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      return date < todayDate;
   };

   const isSelectedDate = (day: number) => {
      if (!selectedDate) return false;
      return selectedDate.getDate() === day &&
         selectedDate.getMonth() === currentMonth.getMonth() &&
         selectedDate.getFullYear() === currentMonth.getFullYear();
   };

   const isTodayDate = (day: number) => {
      return day === today.getDate() &&
         currentMonth.getMonth() === today.getMonth() &&
         currentMonth.getFullYear() === today.getFullYear();
   };

   const handleDayClick = (day: number) => {
      if (isPastDate(day)) return;
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      onDateSelect(date);
   };

   const goToPreviousMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
   };

   const goToNextMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
   };

   return (
      <CalendarContainer>
         <CalendarHeader>
            <MonthNavButton onClick={goToPreviousMonth}>
               <ChevronLeft size={20} />
            </MonthNavButton>
            <MonthTitle>
               {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </MonthTitle>
            <MonthNavButton onClick={goToNextMonth}>
               <ChevronRight size={20} />
            </MonthNavButton>
         </CalendarHeader>
         <Grid>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <DayLabel key={d}>{d}</DayLabel>)}
            {blanks.map(i => <EmptyCell key={`blank-${i}`} />)}
            {days.map(d => {
               const reminders = getRemindersForDay(d);
               const isPast = isPastDate(d);
               const isSelected = isSelectedDate(d);
               const isToday = isTodayDate(d);
               return (
                  <DayCell
                     key={d}
                     $isToday={isToday}
                     $isSelected={isSelected}
                     $isPast={isPast}
                     $hasReminders={reminders.length > 0}
                     onClick={() => handleDayClick(d)}
                  >
                     {d}
                     {isToday && <TodayDot />}
                     {reminders.length > 0 && !isPast && (
                        <ReminderBadge>{reminders.length}</ReminderBadge>
                     )}
                  </DayCell>
               );
            })}
         </Grid>
      </CalendarContainer>
   );
};

export const ReminderPage: React.FC = () => {
   const [reminders, setReminders] = useState<ReminderSetting[]>([
      { id: 'morning', label: 'Morning Check-in', time: '09:00', enabled: true, type: 'daily' },
      { id: 'afternoon', label: 'Afternoon Check-in', time: '14:00', enabled: false, type: 'daily' },
      { id: 'evening', label: 'Evening Check-in', time: '20:00', enabled: true, type: 'daily' },
   ]);
   const [scheduledReminders, setScheduledReminders] = useState<ReminderSetting[]>([]);
   const [selectedDate, setSelectedDate] = useState<Date | null>(null);
   const [isAddingReminder, setIsAddingReminder] = useState(false);
   const [newReminderLabel, setNewReminderLabel] = useState('');
   const [newReminderTime, setNewReminderTime] = useState('09:00');
   const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>(Notification.permission);
   const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

   useEffect(() => {
      const saved = localStorage.getItem('mindfulness_reminders');
      if (saved) {
         setReminders(JSON.parse(saved));
      }
      const savedScheduled = localStorage.getItem('scheduled_reminders');
      if (savedScheduled) {
         setScheduledReminders(JSON.parse(savedScheduled));
      }
   }, []);

   const handleToggle = (id: string) => {
      setReminders(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
   };

   const handleTimeChange = (id: string, time: string) => {
      setReminders(prev => prev.map(r => r.id === id ? { ...r, time } : r));
   };

   const handleSave = () => {
      setSaveStatus('saving');
      localStorage.setItem('mindfulness_reminders', JSON.stringify(reminders));
      localStorage.setItem('scheduled_reminders', JSON.stringify(scheduledReminders));
      setTimeout(() => {
         setSaveStatus('saved');
         setTimeout(() => setSaveStatus('idle'), 2000);
      }, 800);
   };

   const handleRequestPermission = async () => {
      const granted = await requestNotificationPermission();
      setPermissionStatus(Notification.permission);
   };

   const handleDateSelect = (date: Date) => {
      setSelectedDate(date);
      setIsAddingReminder(true);
      setNewReminderLabel('');
      setNewReminderTime('09:00');
   };

   const handleAddScheduledReminder = () => {
      if (!selectedDate || !newReminderLabel.trim()) return;

      const newReminder: ReminderSetting = {
         id: `scheduled-${Date.now()}`,
         label: newReminderLabel,
         time: newReminderTime,
         enabled: true,
         type: 'scheduled',
         date: selectedDate.toISOString().split('T')[0]
      };

      setScheduledReminders(prev => [...prev, newReminder]);
      setIsAddingReminder(false);
      setNewReminderLabel('');
      setNewReminderTime('09:00');
   };

   const handleDeleteScheduledReminder = (id: string) => {
      setScheduledReminders(prev => prev.filter(r => r.id !== id));
   };

   const getRemindersForSelectedDate = () => {
      if (!selectedDate) return [];
      const dateStr = selectedDate.toISOString().split('T')[0];
      return scheduledReminders.filter(r => r.date === dateStr);
   };

   return (
      <Container>
         <ContentWrapper>
            <LeftPanel>
               <DigitalClock />
               <CalendarGrid
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                  scheduledReminders={scheduledReminders}
               />

            </LeftPanel>

            <RightPanel>
               <Header>
                  <TitleSection>
                     <img src="/bell.png" alt="Reminders" style={{ width: '32px', height: '32px' }} />
                     <Title>Reminders</Title>
                  </TitleSection>
               </Header>

               {permissionStatus !== 'granted' && (
                  <AlertBox>
                     <AlertCircle size={20} />
                     <div>
                        <strong>Notifications disabled</strong>
                        <p>Enable browser notifications to receive check-ins.</p>
                     </div>
                     <RequestButton onClick={handleRequestPermission}>Enable</RequestButton>
                  </AlertBox>
               )}

               <SettingsCard>
               
                  <ReminderList>
                     {reminders.map(reminder => (
                        <ReminderItem key={reminder.id}>
                           <ReminderInfo>
                              <ReminderLabel>{reminder.label}</ReminderLabel>
                              <TimeInput
                                 type="time"
                                 value={reminder.time}
                                 onChange={(e) => handleTimeChange(reminder.id, e.target.value)}
                              />
                           </ReminderInfo>
                           <ToggleButton
                              $enabled={reminder.enabled}
                              onClick={() => handleToggle(reminder.id)}
                           >
                              <ToggleThumb $enabled={reminder.enabled} />
                           </ToggleButton>
                        </ReminderItem>
                     ))}
                  </ReminderList>
               </SettingsCard>

               {selectedDate && (
                  <SettingsCard>
                     <CardTitle>
                        Scheduled for {selectedDate.toLocaleDateString('en-US', {
                           weekday: 'long',
                           month: 'long',
                           day: 'numeric'
                        })}
                     </CardTitle>

                     {getRemindersForSelectedDate().length > 0 && (
                        <ReminderList>
                           {getRemindersForSelectedDate().map(reminder => (
                              <ReminderItem key={reminder.id}>
                                 <ReminderInfo>
                                    <ReminderLabel>{reminder.label}</ReminderLabel>
                                    <TimeDisplay>{reminder.time}</TimeDisplay>
                                 </ReminderInfo>
                                 <DeleteButton onClick={() => handleDeleteScheduledReminder(reminder.id)}>
                                    <Trash2 size={18} />
                                 </DeleteButton>
                              </ReminderItem>
                           ))}
                        </ReminderList>
                     )}

                     {isAddingReminder && (
                        <AddReminderForm>
                           <FormGroup>
                              <Label>Reminder Label</Label>
                              <Input
                                 type="text"
                                 placeholder="e.g., Doctor Appointment, Meditation"
                                 value={newReminderLabel}
                                 onChange={(e) => setNewReminderLabel(e.target.value)}
                              />
                           </FormGroup>
                           <FormGroup>
                              <Label>Time</Label>
                              <TimeInput
                                 type="time"
                                 value={newReminderTime}
                                 onChange={(e) => setNewReminderTime(e.target.value)}
                              />
                           </FormGroup>
                           <FormActions>
                              <CancelButton onClick={() => setIsAddingReminder(false)}>
                                 Cancel
                              </CancelButton>
                              <AddButton onClick={handleAddScheduledReminder}>
                                 <Plus size={18} />
                                 Add Reminder
                              </AddButton>
                           </FormActions>
                        </AddReminderForm>
                     )}

                     {!isAddingReminder && getRemindersForSelectedDate().length === 0 && (
                        <EmptyState>
                           <p>No reminders scheduled for this day</p>
                           <AddButton onClick={() => setIsAddingReminder(true)}>
                              <Plus size={18} />
                              Add Reminder
                           </AddButton>
                        </EmptyState>
                     )}
                  </SettingsCard>
               )}

               <Footer>
                  <SaveButton onClick={handleSave} disabled={saveStatus !== 'idle'}>
                     {saveStatus === 'saving' ? 'Saving...' :
                        saveStatus === 'saved' ? <><CheckCircle2 size={18} /> Saved</> :
                           'Save All Reminders'}
                  </SaveButton>
               </Footer>
            </RightPanel>
         </ContentWrapper>
      </Container>
   );
};

const Container = styled.div`
  flex: 1;
  background: #ffffff;
  color: #111827;
  padding: 40px;
  overflow-y: auto;
  height: 100%;
  display: flex;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  display: flex;
  gap: 40px;
  align-items: flex-start;
  
  @media (max-width: 968px) {
    flex-direction: column;
  }
`;

const LeftPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ClockContainer = styled.div`
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.03);
  border-radius: 16px;
  padding: 30px;
  text-align: center;
  backdrop-filter: blur(10px);
`;

const TimeText = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin: 0;
  color: #111827;
`;

const DateText = styled.p`
  color: #666;
  margin: 8px 0 0;
  font-size: 1.1rem;
`;

const CalendarContainer = styled.div`
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.03) 0%, rgba(0, 0, 0, 0.02) 100%);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 24px;
  padding: 32px;
  backdrop-filter: blur(20px);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(129, 140, 248, 0.5), transparent);
  }
`;

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 16px;
`;

const MonthTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #111827;
  flex: 1;
  text-align: center;
`;

const MonthNavButton = styled.button`
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.08);
  color: #aaa;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: rgba(129, 140, 248, 0.15);
    border-color: rgba(129, 140, 248, 0.3);
    color: #818cf8;
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
`;

const DayLabel = styled.div`
  text-align: center;
  font-size: 0.8rem;
  color: #444;
  font-weight: 600;
  padding-bottom: 8px;
`;

const DayCell = styled.div<{ $isToday?: boolean; $isSelected?: boolean; $isPast?: boolean; $hasReminders?: boolean }>`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 0.9rem;
  color: ${props => props.$isPast ? '#444' : props.$isToday || props.$isSelected ? '#fff' : '#888'};
  background: ${props =>
      props.$isSelected ? 'rgba(129, 140, 248, 0.3)' :
         props.$isToday ? 'rgba(129, 140, 248, 0.2)' :
            props.$hasReminders ? 'rgba(129, 140, 248, 0.05)' :
               'transparent'};
  border: ${props =>
      props.$isSelected ? '2px solid rgba(129, 140, 248, 0.8)' :
         props.$isToday ? '1px solid rgba(129, 140, 248, 0.5)' :
            props.$hasReminders ? '1px solid rgba(129, 140, 248, 0.2)' :
               '1px solid rgba(255,255,255,0.02)'};
  position: relative;
  cursor: ${props => props.$isPast ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  
  &:hover {
    ${props => !props.$isPast && `
      background: rgba(129, 140, 248, 0.15);
      border-color: rgba(129, 140, 248, 0.4);
      transform: scale(1.05);
    `}
  }
`;

const ReminderBadge = styled.div`
  position: absolute;
  top: 2px;
  right: 2px;
  background: #818cf8;
  color: #111827;
  font-size: 0.65rem;
  font-weight: 700;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TodayDot = styled.div`
  position: absolute;
  bottom: 4px;
  width: 4px;
  height: 4px;
  background: #818cf8;
  border-radius: 50%;
`;

const EmptyCell = styled.div`
  aspect-ratio: 1;
`;

const Header = styled.header`
  margin-bottom: 24px;
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
`;

const AlertBox = styled.div`
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0.03) 100%);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 16px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  color: #f59e0b;
  box-shadow: 
    0 4px 16px rgba(245, 158, 11, 0.1),
    inset 0 1px 0 rgba(245, 158, 11, 0.1);
  backdrop-filter: blur(10px);
  
  strong { display: block; font-size: 0.9rem; font-weight: 600; }
  p { margin: 0; font-size: 0.85rem; opacity: 0.9; }
`;

const RequestButton = styled.button`
  margin-left: auto;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #000;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 
    0 4px 12px rgba(245, 158, 11, 0.3),
    inset 0 1px 0 rgba(0, 0, 0, 0.2);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 6px 16px rgba(245, 158, 11, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const SettingsCard = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(0, 0, 0, 0.02) 100%);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 24px;
  padding: 32px;
  backdrop-filter: blur(20px);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(0, 0, 0, 0.08);
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(0, 0, 0, 0.1);
  }
`;

const CardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 24px;
  color: #111827;
`;

const ReminderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ReminderItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
  &:last-child { border: none; padding-bottom: 0; }
`;

const ReminderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ReminderLabel = styled.span`
  font-weight: 500;
  color: #111827;
`;

const TimeInput = styled.input`
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  color: #111827;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 0.9rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.3),
    0 1px 0 rgba(0, 0, 0, 0.03);
  
  &:focus {
    outline: none;
    border-color: rgba(129, 140, 248, 0.5);
    box-shadow: 
      inset 0 2px 4px rgba(0, 0, 0, 0.3),
      0 0 0 3px rgba(129, 140, 248, 0.1),
      0 1px 0 rgba(0, 0, 0, 0.03);
  }
  
  &::-webkit-calendar-picker-indicator {
    filter: invert(1) brightness(0.8);
    cursor: pointer;
  }
`;

const ToggleButton = styled.button<{ $enabled: boolean }>`
  width: 54px;
  height: 30px;
  border-radius: 15px;
  background: ${props => props.$enabled
      ? 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)'
      : 'linear-gradient(135deg, rgba(34, 34, 34, 0.8) 0%, rgba(17, 17, 17, 0.9) 100%)'};
  position: relative;
  border: 1px solid ${props => props.$enabled ? 'rgba(129, 140, 248, 0.5)' : 'rgba(0, 0, 0, 0.08)'};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.$enabled
      ? '0 4px 12px rgba(129, 140, 248, 0.3), inset 0 1px 0 rgba(0, 0, 0, 0.12)'
      : 'inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 0 rgba(0, 0, 0, 0.03)'};
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const ToggleThumb = styled.div<{ $enabled: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  position: absolute;
  top: 3px;
  left: ${props => props.$enabled ? '28px' : '3px'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
`;

const TimeDisplay = styled.span`
  color: #888;
  font-size: 0.9rem;
  font-family: monospace;
`;

const DeleteButton = styled.button`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.5);
  }
`;

const AddReminderForm = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.03);
  border-radius: 16px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
  
  &:last-of-type {
    margin-bottom: 20px;
  }
`;

const Label = styled.label`
  display: block;
  color: #aaa;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  color: #111827;
  padding: 11px 14px;
  border-radius: 10px;
  font-size: 0.9rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.3),
    0 1px 0 rgba(0, 0, 0, 0.03);
  
  &:focus {
    outline: none;
    border-color: rgba(129, 140, 248, 0.5);
    box-shadow: 
      inset 0 2px 4px rgba(0, 0, 0, 0.3),
      0 0 0 3px rgba(129, 140, 248, 0.1),
      0 1px 0 rgba(0, 0, 0, 0.03);
  }
  
  &::placeholder {
    color: #666;
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const CancelButton = styled.button`
  background: transparent;
  border: 1px solid #333;
  color: #aaa;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(0, 0, 0, 0.03);
    border-color: #555;
  }
`;

const AddButton = styled.button`
  background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
  border: none;
  color: #111827;
  padding: 11px 22px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 
    0 4px 12px rgba(129, 140, 248, 0.3),
    inset 0 1px 0 rgba(0, 0, 0, 0.12);
  
  &:hover {
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    transform: translateY(-2px);
    box-shadow: 
      0 6px 16px rgba(129, 140, 248, 0.4),
      inset 0 1px 0 rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  
  p {
    color: #666;
    margin: 0 0 20px;
    font-size: 0.9rem;
  }
`;

const Footer = styled.div`
  margin-top: 32px;
  display: flex;
  justify-content: flex-end;
`;

const SaveButton = styled.button`
  background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
  color: #111827;
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 4px 16px rgba(129, 140, 248, 0.3),
    inset 0 1px 0 rgba(0, 0, 0, 0.12);
  
  &:disabled { 
    opacity: 0.5; 
    cursor: not-allowed;
    transform: none !important;
  }
  
  &:hover:not(:disabled) { 
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    transform: translateY(-2px);
    box-shadow: 
      0 6px 20px rgba(129, 140, 248, 0.4),
      inset 0 1px 0 rgba(0, 0, 0, 0.2);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const InfoCard = styled.div`
  background: linear-gradient(135deg, rgba(129, 140, 248, 0.08) 0%, rgba(129, 140, 248, 0.03) 100%);
  border: 1px solid rgba(129, 140, 248, 0.25);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 
    0 4px 16px rgba(129, 140, 248, 0.1),
    inset 0 1px 0 rgba(129, 140, 248, 0.1);
  backdrop-filter: blur(10px);
  
  h4 { 
    margin: 0 0 12px; 
    color: #a78bfa; 
    font-size: 0.85rem; 
    text-transform: uppercase; 
    letter-spacing: 0.05em;
    font-weight: 700;
  }
  
  p { 
    margin: 0; 
    color: #999; 
    font-size: 0.9rem; 
    line-height: 1.6; 
  }
`;
