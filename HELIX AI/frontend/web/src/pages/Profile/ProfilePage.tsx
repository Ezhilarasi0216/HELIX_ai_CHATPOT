import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  User, 
  Mail, 
  Phone, 
  Shield, 
  ChevronRight, 
  ArrowLeft 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmotion } from '../../context/EmotionContext';
import { API_BASE_URL } from '../../utils/api_config';

export const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { user, refreshUser } = useEmotion();
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
    }, [user?.user_id]);

    const loadProfile = async () => {
        if (!user?.user_id) return;
        try {
            const response = await fetch(`${API_BASE}/profile/${user.user_id}`);
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

                // Sync to global state
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
        <div className="bg-[#F7F9FB] font-sans text-slate-700 min-h-screen overflow-y-auto">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/chat')} className="p-2 hover:bg-[#E0F2F1] rounded-full transition-all">
                            <ArrowLeft className="w-6 h-6 text-[#00897B]" />
                        </button>
                        <h1 className="text-xl font-semibold text-slate-800">Profile</h1>
                    </div>
                    <button onClick={handleSave} disabled={loading} className="text-[#00897B] font-medium hover:underline">
                        {loading ? 'Saving...' : 'Done'}
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 pb-20">
                <section className="flex flex-col items-center text-center space-y-4 py-4">
                    <div className="relative">
                        <div className="w-28 h-28 rounded-full border-4 border-white shadow-sm overflow-hidden bg-white">
                            {profileData.avatar_url ? (
                                <img src={`${API_BASE}${profileData.avatar_url}`} alt="Profile" className="w-full h-full object-cover" />
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
                        <h2 className="text-2xl font-bold text-slate-800">{profileData.full_name || 'Arun'}</h2>
                        <p className="text-slate-500">{profileData.email}</p>
                        {success && <p className="text-[#00897B] text-xs font-bold mt-2 animate-bounce">✓ UPDATED</p>}
                    </div>
                </section>

                <div className="grid grid-cols-1 gap-6">
                    <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                                <User className="w-5 h-5 text-[#4DB6AC]" />
                                Information
                            </h3>
                            <button onClick={handleSave} className="text-xs font-bold text-[#4DB6AC] uppercase hover:underline">Save</button>
                        </div>
                        <div className="divide-y divide-slate-100">
                            <EditableRow 
                                label="Full Name" 
                                value={profileData.full_name} 
                                onChange={(val) => setProfileData({...profileData, full_name: val})}
                            />
                            <div className="p-5 flex flex-col gap-2 bg-slate-50/30">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-1">Email Address</label>
                                <div className="w-full bg-slate-100/50 border border-slate-100 rounded-2xl px-5 py-4 text-sm text-slate-400 font-semibold cursor-not-allowed">
                                    {profileData.email}
                                </div>
                            </div>
                            <EditableRow 
                                label="Phone" 
                                value={profileData.phone_number} 
                                onChange={(val) => setProfileData({...profileData, phone_number: val})}
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
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

const EditableRow: React.FC<{ label: string, value: string, onChange: (val: string) => void }> = ({ label, value, onChange }) => (
    <div className="p-5 flex flex-col gap-2 group transition-all duration-300">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-1 group-focus-within:text-[#00897B] transition-colors">
            {label}
        </label>
        <div className="relative">
            <input 
                className="w-full bg-[#f8fafc] border border-slate-100 rounded-2xl px-5 py-4 text-sm text-slate-700 font-semibold focus:bg-white focus:border-[#4DB6AC]/50 focus:ring-4 focus:ring-[#4DB6AC]/10 outline-none transition-all duration-300"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-200 group-focus-within:text-[#4DB6AC] transition-all duration-300">
                <ChevronRight size={18} />
            </div>
        </div>
    </div>
);
