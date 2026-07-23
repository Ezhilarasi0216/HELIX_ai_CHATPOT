import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Users, Plus, Trash2, Edit2, Phone, Shield, Save, X } from 'lucide-react';
import axios from 'axios';

interface EmergencyContact {
   id?: string;
   name: string;
   phone: string;
   relationship: string;
   is_primary: boolean;
}

export const EmergencyContactsPage: React.FC = () => {
   const [contacts, setContacts] = useState<EmergencyContact[]>([]);
   const [isAdding, setIsAdding] = useState(false);
   const [editingId, setEditingId] = useState<string | null>(null);
   const [formData, setFormData] = useState<EmergencyContact>({
      name: '',
      phone: '',
      relationship: '',
      is_primary: false
   });

   const userId = localStorage.getItem('user_id') || 'guest';

   useEffect(() => {
      fetchContacts();
   }, []);

   const fetchContacts = async () => {
      try {
         const response = await axios.get(`http://localhost:8003/emergency/list/${userId}`);
         setContacts(response.data.contacts);
      } catch (error) {
         console.error('Error fetching contacts:', error);
      }
   };

   const handleAdd = async () => {
      try {
         await axios.post('http://localhost:8003/emergency/add', {
            user_id: userId,
            contact: formData
         });
         setIsAdding(false);
         setFormData({ name: '', phone: '', relationship: '', is_primary: false });
         fetchContacts();
      } catch (error) {
         console.error('Error adding contact:', error);
      }
   };

   const handleUpdate = async (id: string) => {
      try {
         await axios.put(`http://localhost:8003/emergency/update/${id}`, formData);
         setEditingId(null);
         setFormData({ name: '', phone: '', relationship: '', is_primary: false });
         fetchContacts();
      } catch (error) {
         console.error('Error updating contact:', error);
      }
   };

   const handleDelete = async (id: string) => {
      if (!confirm('Are you sure you want to delete this contact?')) return;
      try {
         await axios.delete(`http://localhost:8003/emergency/delete/${id}`);
         fetchContacts();
      } catch (error) {
         console.error('Error deleting contact:', error);
      }
   };

   const startEdit = (contact: EmergencyContact) => {
      setEditingId(contact.id!);
      setFormData(contact);
   };

   return (
      <Container>
         <Header>
            <TitleSection>
               <Shield size={32} color="#818cf8" />
               <div>
                  <Title>Emergency Contacts</Title>
                  <Subtitle>Trusted people who can help you in a crisis</Subtitle>
               </div>
            </TitleSection>
            <AddButton onClick={() => setIsAdding(true)}>
               <Plus size={18} />
               Add Contact
            </AddButton>
         </Header>

         <Content>
            {(isAdding || editingId) && (
               <FormCard>
                  <FormTitle>{editingId ? 'Edit Contact' : 'Add New Contact'}</FormTitle>
                  <FormGrid>
                     <Input
                        placeholder="Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                     />
                     <Input
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                     />
                     <Input
                        placeholder="Relationship (e.g., Mother, Friend)"
                        value={formData.relationship}
                        onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                     />
                     <CheckboxLabel>
                        <input
                           type="checkbox"
                           checked={formData.is_primary}
                           onChange={(e) => setFormData({ ...formData, is_primary: e.target.checked })}
                        />
                        Primary Contact
                     </CheckboxLabel>
                  </FormGrid>
                  <FormActions>
                     <CancelButton onClick={() => {
                        setIsAdding(false);
                        setEditingId(null);
                        setFormData({ name: '', phone: '', relationship: '', is_primary: false });
                     }}>
                        <X size={16} />
                        Cancel
                     </CancelButton>
                     <SaveButton onClick={() => editingId ? handleUpdate(editingId) : handleAdd()}>
                        <Save size={16} />
                        Save
                     </SaveButton>
                  </FormActions>
               </FormCard>
            )}

            <ContactsList>
               {contacts.length === 0 ? (
                  <EmptyState>
                     <Users size={48} color="#444" />
                     <p>No emergency contacts yet</p>
                     <small>Add trusted people who can help you in difficult times</small>
                  </EmptyState>
               ) : (
                  contacts.map((contact) => (
                     <ContactCard key={contact.id} $isPrimary={contact.is_primary}>
                        {contact.is_primary && <PrimaryBadge>Primary</PrimaryBadge>}
                        <ContactInfo>
                           <ContactName>{contact.name}</ContactName>
                           <ContactPhone>
                              <Phone size={14} />
                              {contact.phone}
                           </ContactPhone>
                           <ContactRelation>{contact.relationship}</ContactRelation>
                        </ContactInfo>
                        <ContactActions>
                           <IconButton onClick={() => startEdit(contact)}>
                              <Edit2 size={16} />
                           </IconButton>
                           <IconButton onClick={() => handleDelete(contact.id!)}>
                              <Trash2 size={16} />
                           </IconButton>
                        </ContactActions>
                     </ContactCard>
                  ))
               )}
            </ContactsList>

            <InfoCard>
               <h4>Privacy & Security</h4>
               <p>Your emergency contacts are stored securely and will only be contacted if you explicitly request help or in critical situations detected by Healix AI.</p>
            </InfoCard>
         </Content>
      </Container>
   );
};

const Container = styled.div`
  flex: 1;
  background: #ffffff;
  color: #111827;
  padding: 40px;
  overflow-y: auto;
  height: 100vh;
`;

const Header = styled.header`
  max-width: 800px;
  margin: 0 auto 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
`;

const Subtitle = styled.p`
  color: #666;
  margin: 4px 0 0;
`;

const AddButton = styled.button`
  background: #818cf8;
  color: #111827;
  border: none;
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #6366f1;
    transform: translateY(-2px);
  }
`;

const Content = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormCard = styled.div`
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  padding: 24px;
`;

const FormTitle = styled.h3`
  margin: 0 0 20px;
  font-size: 1.1rem;
  font-weight: 600;
`;

const FormGrid = styled.div`
  display: grid;
  gap: 16px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  background: #222;
  border: 1px solid #333;
  color: #111827;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #818cf8;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
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
  color: #111827;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.03);
  }
`;

const SaveButton = styled.button`
  background: #10b981;
  color: #111827;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #059669;
  }
`;

const ContactsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ContactCard = styled.div<{ $isPrimary: boolean }>`
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid ${props => props.$isPrimary ? 'rgba(129, 140, 248, 0.3)' : 'rgba(0, 0, 0, 0.08)'};
  border-radius: 16px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.03);
    transform: translateY(-2px);
  }
`;

const PrimaryBadge = styled.span`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(129, 140, 248, 0.2);
  color: #818cf8;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const ContactInfo = styled.div`
  flex: 1;
`;

const ContactName = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 6px;
`;

const ContactPhone = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #818cf8;
  font-weight: 500;
  margin-bottom: 4px;
`;

const ContactRelation = styled.div`
  color: #888;
  font-size: 0.9rem;
`;

const ContactActions = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.08);
  color: #111827;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.08);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;

  p {
    margin: 16px 0 8px;
    font-size: 1.1rem;
    font-weight: 600;
  }

  small {
    font-size: 0.9rem;
  }
`;

const InfoCard = styled.div`
  background: rgba(129, 140, 248, 0.05);
  border: 1px solid rgba(129, 140, 248, 0.2);
  border-radius: 16px;
  padding: 20px;

  h4 {
    margin: 0 0 10px;
    color: #818cf8;
    font-size: 0.9rem;
    text-transform: uppercase;
  }

  p {
    margin: 0;
    color: #888;
    font-size: 0.9rem;
    line-height: 1.6;
  }
`;
