import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  User, 
  Mail, 
  Phone, 
  Shield, 
  ChevronRight, 
  ArrowLeft, 
  Bell, 
  Smartphone, 
  Monitor,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmotion } from '../../context/EmotionContext';
import { API_BASE_URL } from '../../utils/api_config';

export const SettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, isTamilMode, setIsTamilMode, refreshUser } = useEmotion();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const API_BASE = API_BASE_URL;
    
    const [profileData, setProfileData] = useState({
        full_name: user?.full_name || '',
        email: user?.email || '',
        date_of_birth: '',
        phone_number: '',
        bio: '',
        avatar_url: user?.avatar_url || user?.profile_photo || ''
    });

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        loadProfile();
    }, [user.user_id]);

    const loadProfile = async () => {
        try {
            const response = await fetch(`http://localhost:8003/profile/${user.user_id}`);
            if (response.ok) {
                const data = await response.json();
                setProfileData({
                    full_name: data.full_name || '',
                    email: data.email || '',
                    date_of_birth: data.date_of_birth || '',
                    phone_number: data.phone_number || '',
                    bio: data.bio || '',
                    avatar_url: data.avatar_url || ''
                });
                
                // Sync to context/localStorage
                const userData = JSON.parse(localStorage.getItem('user') || '{}');
                const updatedUser = { 
                    ...userData, 
                    full_name: data.full_name || userData.full_name,
                    profile_photo: data.avatar_url || userData.profile_photo,
                    avatar_url: data.avatar_url || userData.avatar_url
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                refreshUser();
            }
        } catch (err) {
            console.error("Failed to load profile", err);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/profile/${user.user_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData)
            });
            if (response.ok) {
                // Update local storage so other components (sidebar) update
                const userData = JSON.parse(localStorage.getItem('user') || '{}');
                const updatedUser = { 
                    ...userData, 
                    full_name: profileData.full_name,
                    profile_photo: profileData.avatar_url,
                    avatar_url: profileData.avatar_url 
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                refreshUser();
                
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (err) {
            console.error("Update failed", err);
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('user_id', user.user_id);

        try {
            const response = await fetch(`${API_BASE}/profile/avatar/${user.user_id}`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                const newAvatarUrl = data.avatar_url;
                
                setProfileData(prev => ({ ...prev, avatar_url: newAvatarUrl }));
                
                // Update local storage
                const userData = JSON.parse(localStorage.getItem('user') || '{}');
                const updatedUser = { 
                    ...userData, 
                    profile_photo: newAvatarUrl,
                    avatar_url: newAvatarUrl 
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                refreshUser();

                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (err) {
            console.error("Upload failed", err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-[#F7F9FB] font-sans text-slate-700 min-h-screen">
            {/* BEGIN: Navigation Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/chat')}
                            className="p-2 hover:bg-[#E0F2F1] rounded-full transition-all duration-300"
                        >
                            <ArrowLeft className="w-6 h-6 text-[#00897B]" />
                        </button>
                        <h1 className="text-xl font-semibold text-slate-800">Settings</h1>
                    </div>
                    <button 
                        onClick={handleSave}
                        disabled={loading}
                        className="text-[#00897B] font-medium hover:underline disabled:opacity-50 flex items-center gap-1"
                    >
                        {loading ? 'Saving...' : 'Done'}
                    </button>
                </div>
            </header>
            {/* END: Navigation Header */}

            <main className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 pb-20">
                {/* BEGIN: User Profile Header */}
                <section className="flex flex-col items-center text-center space-y-4 py-4">
                    <div className="relative group">
                        <div className="w-28 h-28 rounded-full border-4 border-white shadow-sm overflow-hidden bg-white">
                            {profileData.avatar_url ? (
                                <img 
                                    src={`${API_BASE}${profileData.avatar_url}`} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover" 
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-100">
                                    <User className="w-12 h-12 text-slate-400" />
                                </div>
                            )}
                        </div>
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="absolute bottom-0 right-0 bg-[#4DB6AC] text-white p-2 rounded-full shadow-md hover:bg-[#00897B] transition-all"
                        >
                            <Camera className="w-4 h-4" />
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">{profileData.full_name || 'Alex Johnson'}</h2>
                        <p className="text-slate-500">{profileData.email}</p>
                        {success && <p className="text-[#00897B] text-xs font-bold mt-2 animate-bounce">✓ SETTINGS SAVED</p>}
                    </div>
                </section>
                {/* END: User Profile Header */}

                {/* BEGIN: Settings Categories */}
                <div className="grid grid-cols-1 gap-6">
                    {/* Account Information Section */}
                    <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:translate-y-[-2px] transition-all duration-300">
                        <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                                <User className="w-5 h-5 text-[#4DB6AC]" />
                                Account Information
                            </h3>
                            <button onClick={handleSave} className="text-xs font-bold text-[#4DB6AC] uppercase tracking-wider hover:underline">Save</button>
                        </div>
                        
                        <div className="divide-y divide-slate-100">
                            <EditableRow 
                                label="Display Name" 
                                value={profileData.full_name} 
                                onChange={(val) => setProfileData({...profileData, full_name: val})}
                                placeholder="Edit Name"
                            />
                            <EditableRow 
                                label="Phone Number" 
                                value={profileData.phone_number} 
                                onChange={(val) => setProfileData({...profileData, phone_number: val})}
                                placeholder="Add phone"
                            />
                            <div className="p-5 flex flex-col gap-2 bg-slate-50/30">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-1">Email Address</label>
                                <div className="w-full bg-slate-100/50 border border-slate-100 rounded-2xl px-5 py-4 text-sm text-slate-400 font-semibold cursor-not-allowed">
                                    {profileData.email}
                                </div>
                            </div>
                            <EditableRow 
                                label="Date of Birth" 
                                value={profileData.date_of_birth} 
                                type="date"
                                onChange={(val) => setProfileData({...profileData, date_of_birth: val})}
                            />
                            <div className="p-5 flex flex-col gap-2 group transition-all duration-300">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-1 group-focus-within:text-[#00897B] transition-colors">Bio</label>
                                <textarea 
                                    className="w-full bg-[#f8fafc] border border-slate-100 rounded-2xl px-5 py-4 text-sm text-slate-700 font-semibold focus:bg-white focus:border-[#4DB6AC]/50 focus:ring-4 focus:ring-[#4DB6AC]/10 outline-none transition-all duration-300 placeholder:text-slate-300 resize-none"
                                    value={profileData.bio}
                                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                                    placeholder="Tell Healix about yourself..."
                                    rows={3}
                                />
                            </div>
                            <div className="p-4 flex justify-between items-center hover:bg-red-50 cursor-pointer text-red-500 font-medium transition-colors">
                                <span className="text-sm">Delete Account</span>
                            </div>
                        </div>
                    </section>

                    {/* AI Behavior Section */}
                    <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:translate-y-[-2px] transition-all duration-300">
                        <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                                <Monitor className="w-5 h-5 text-[#4DB6AC]" />
                                AI Behavior
                            </h3>
                        </div>
                        <div className="p-4 space-y-4">
                            <ToggleItem 
                                label="Healix Tamil Mode" 
                                checked={isTamilMode} 
                                onChange={() => setIsTamilMode(!isTamilMode)}
                            />
                            <p className="text-xs text-slate-400 italic px-1">
                                Healix will switch to a natural Tamil-English mix for conversations.
                            </p>
                        </div>
                    </section>

                    {/* Notifications Section */}
                    <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:translate-y-[-2px] transition-all duration-300">
                        <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                                <Bell className="w-5 h-5 text-[#4DB6AC]" />
                                Notifications
                            </h3>
                        </div>
                        <div className="p-4 space-y-4">
                            <ToggleItem label="Push Notifications" checked={true} />
                            <ToggleItem label="Daily Check-in Reminder" checked={true} />
                            <ToggleItem label="Weekly Email Summary" checked={false} />
                        </div>
                    </section>

                    {/* Linked Devices Section */}
                    <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:translate-y-[-2px] transition-all duration-300">
                        <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                                <Smartphone className="w-5 h-5 text-[#4DB6AC]" />
                                Linked Devices
                            </h3>
                        </div>
                        <div className="divide-y divide-slate-100">
                            <DeviceRow name="iPhone 14 Pro" status="Active now • London, UK" current />
                            <DeviceRow name="MacBook Pro 16-inch" status="Last active: 2 days ago" />
                        </div>
                    </section>
                </div>
                {/* END: Settings Categories */}

                {/* BEGIN: Support Footer */}
                <footer className="mt-12 text-center pb-8">
                    <p className="text-slate-400 text-sm">Version 2.4.1 (Stable)</p>
                    <div className="mt-4 flex justify-center gap-6">
                        <a className="text-[#4DB6AC] text-sm font-medium hover:underline" href="#">Help Center</a>
                        <a className="text-[#4DB6AC] text-sm font-medium hover:underline" href="#">Privacy Policy</a>
                        <a className="text-[#4DB6AC] text-sm font-medium hover:underline" href="#">Terms of Service</a>
                    </div>
                    <button 
                        onClick={() => {
                            localStorage.removeItem('user');
                            navigate('/login');
                        }}
                        className="mt-8 px-8 py-2 border border-slate-200 rounded-full text-slate-600 font-medium hover:bg-white hover:border-slate-300 transition-all duration-300"
                    >
                        Log Out
                    </button>
                </footer>
                {/* END: Support Footer */}
            </main>
        </div>
    );
};

// --- Sub-components to match the requested style exactly ---

const EditableRow: React.FC<{ 
    label: string, 
    value: string, 
    onChange: (val: string) => void,
    placeholder?: string,
    type?: string
}> = ({ label, value, onChange, placeholder, type = "text" }) => (
    <div className="p-5 flex flex-col gap-2 group transition-all duration-300">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-1 group-focus-within:text-[#00897B] transition-colors">
            {label}
        </label>
        <div className="relative">
            <input 
                type={type}
                className="w-full bg-[#f8fafc] border border-slate-100 rounded-2xl px-5 py-4 text-sm text-slate-700 font-semibold focus:bg-white focus:border-[#4DB6AC]/50 focus:ring-4 focus:ring-[#4DB6AC]/10 outline-none transition-all duration-300 placeholder:text-slate-300"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-200 group-focus-within:text-[#4DB6AC] transition-all duration-300">
                <ChevronRight size={18} />
            </div>
        </div>
    </div>
);

const ToggleItem: React.FC<{ 
    label: string, 
    checked: boolean,
    onChange?: () => void 
}> = ({ label, checked, onChange }) => (
    <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <button 
            onClick={onChange}
            className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${checked ? 'bg-[#4DB6AC]' : 'bg-gray-200'}`}
        >
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
    </div>
);

const DeviceRow: React.FC<{ name: string, status: string, current?: boolean }> = ({ name, status, current }) => (
    <div className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${current ? 'bg-[#E0F2F1]' : 'bg-slate-100'}`}>
                <Smartphone className={`w-5 h-5 ${current ? 'text-[#4DB6AC]' : 'text-slate-400'}`} />
            </div>
            <div>
                <p className="text-sm font-medium">{name}</p>
                <p className="text-xs text-slate-500">{status}</p>
            </div>
        </div>
        {current ? (
            <span className="text-xs font-bold text-[#4DB6AC] uppercase tracking-wider">Current</span>
        ) : (
            <button className="text-xs font-medium text-slate-400 hover:text-red-500 transition-all">Log Out</button>
        )}
    </div>
);

export default SettingsPage;
