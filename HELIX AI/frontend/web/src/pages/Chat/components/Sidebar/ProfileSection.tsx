import React from 'react';
import styled from 'styled-components';
import { LogOut, Settings, User, Star, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmotion } from '../../../../context/EmotionContext';

import { API_BASE_URL } from '../../../../utils/api_config';

export const ProfileSection: React.FC = () => {
  const navigate = useNavigate();
  const { user, wellnessScore } = useEmotion();
  const API_BASE = API_BASE_URL;
  
  const userName = user?.full_name || 'User';
  const avatarUrl = user?.avatar_url || user?.profile_photo;
  const fullAvatarUrl = avatarUrl ? (avatarUrl.startsWith('http') ? avatarUrl : `${API_BASE}${avatarUrl}`) : null;

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Container>
      <ProfileCard onClick={() => navigate('/settings')}>
        <Avatar>
          {fullAvatarUrl ? (
            <ProfileImg src={fullAvatarUrl} alt="Profile" />
          ) : (
            <User size={18} />
          )}
        </Avatar>
        <UserInfo>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <UserName>Hello, {userName.split(' ')[0]}</UserName>
              <ScoreBadge>
                <Star size={8} fill="currentColor" />
                <span>{wellnessScore}</span>
              </ScoreBadge>
            </div>
            <UserEmail>{user?.email || 'guest@healix.ai'}</UserEmail>
          </div>
          <SettingsLink>
            Manage Account
          </SettingsLink>
        </UserInfo>
        <ChevronRight size={14} className="text-slate-300 ml-auto" />
      </ProfileCard>

      <Actions>
        <ActionItem onClick={handleLogout}>
          <LogOut size={14} /> Log Out
        </ActionItem>
      </Actions>
    </Container>
  );
};

const Container = styled.div`
  padding: 16px;
  border-top: 1px solid #f1f5f9;
`;

const ProfileCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #f1f5f9;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f8fafc;
    border-color: #e2e8f0;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }
`;

const Avatar = styled.div`
  width: 38px;
  height: 38px;
  background: #E0F2F1;
  border-radius: 50%;
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00897B;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

const ProfileImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

const UserName = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: #1e293b;
`;

const UserEmail = styled.span`
  font-size: 0.7rem;
  color: #64748b;
  margin-top: -2px;
`;

const ScoreBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  background: #00897B;
  color: #ffffff;
  padding: 1px 6px;
  border-radius: 10px;
  font-size: 0.6rem;
  font-weight: 700;
`;

const SettingsLink = styled.span`
  font-size: 0.75rem;
  color: #64748b;
`;

const Actions = styled.div`
  margin-top: 8px;
`;

const ActionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  color: #94a3b8;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #fef2f2;
    color: #ef4444;
  }
`;
