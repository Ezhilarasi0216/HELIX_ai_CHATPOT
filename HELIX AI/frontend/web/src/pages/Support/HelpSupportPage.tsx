import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Search, MessageCircle, Mail, Shield, HelpCircle,
  Book, Video, Users, FileText, ChevronDown, ChevronUp, Send,
  AlertTriangle, Phone, LifeBuoy
} from 'lucide-react';
import { useEmotion } from '../../context/EmotionContext';

const HelpSupportPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    priority: 'medium'
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { setIsSOSOpen } = useEmotion();

  const helplines = [
    { name: "Global Emergency", number: "112", desc: "Standard Emergency Number" },
    { name: "Vandrevala Foundation", number: "9999666555", desc: "24/7 Crisis Support" },
    { name: "Sneha India", number: "044-24640050", desc: "Suicide Prevention" },
    { name: "iCall", number: "9152987821", desc: "Psychosocial Helpline" }
  ];

  const quickLinks = [
    { icon: Book, title: 'Getting Started', description: 'Learn the basics of Healix AI', color: '#818cf8' },
    { icon: HelpCircle, title: 'FAQs', description: 'Common questions answered', color: '#f59e0b' },
    { icon: Video, title: 'Video Tutorials', description: 'Watch how-to guides', color: '#ec4899' },
    { icon: Users, title: 'Community Forum', description: 'Connect with others', color: '#10b981' },
    { icon: Shield, title: 'Privacy & Security', description: 'How we protect your data', color: '#06b6d4' },
    { icon: FileText, title: 'Documentation', description: 'Detailed feature guides', color: '#8b5cf6' },
  ];

  const faqs = [
    {
      question: 'How does Healix AI detect my emotions?',
      answer: 'Healix uses advanced NLP and sentiment analysis to understand the emotional tone of your messages. We also offer optional face emotion detection using TensorFlow.js for real-time monitoring during crisis situations.'
    },
    {
      question: 'Is my data secure and private?',
      answer: 'Yes! All your conversations are encrypted and stored securely. We never share your personal information with third parties. You have full control to delete your data anytime from your profile settings.'
    },
    {
      question: 'Can I use Healix AI in Tamil?',
      answer: 'Absolutely! Healix supports both English and Tamil. You can switch languages in your profile settings, and the AI will respond in your preferred language.'
    },
    {
      question: 'What happens during a crisis detection?',
      answer: 'If Healix detects crisis keywords or prolonged negative emotions through face detection, it will automatically activate the Crisis Alert system, offering helpline numbers and the option to call your emergency contacts.'
    },
    {
      question: 'How do I add emergency contacts?',
      answer: 'Go to Settings → Emergency Contacts. You can add trusted contacts with their name, phone number, and relationship. Mark one as primary for automatic crisis calls.'
    },
    {
      question: 'Can I delete my chat history?',
      answer: 'Yes, you can delete individual messages or your entire chat history from the Chat page menu. This action is permanent and cannot be undone.'
    }
  ];

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to backend
    console.log('Contact form submitted:', contactForm);
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setContactForm({ subject: '', message: '', priority: 'medium' });
    }, 3000);
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </BackButton>

        {/* New SOS/Crisis Section */}
        <EmergencySection>
          <div className="content">
            <div className="badge">
              <AlertTriangle size={16} /> EMERGENCY ASSISTANCE
            </div>
            <h2>Need immediate help?</h2>
            <p>Our Crisis Support bot is here for you. We can also connect you with your emergency contacts or helplines.</p>

            <SOSButtonWrapper>
              <PulseCircle />
              <SOSButton onClick={() => setIsSOSOpen(true)}>
                <Phone size={24} fill="currentColor" />
                Trigger Emergency SOS
              </SOSButton>
            </SOSButtonWrapper>
          </div>

          <HelplineGrid>
            {helplines.map((hl, idx) => (
              <HelplineCard key={idx} onClick={() => window.open(`tel:${hl.number}`)}>
                <div className="name">{hl.name}</div>
                <div className="number">{hl.number}</div>
                <div className="desc">{hl.desc}</div>
              </HelplineCard>
            ))}
          </HelplineGrid>
        </EmergencySection>

        <HeroSection>
          <SearchBar>
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search for help articles, guides, FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBar>
        </HeroSection>
      </Header>

      {/* Quick Links Grid */}
      <Section>
        <SectionTitle>Quick Links</SectionTitle>
        <QuickLinksGrid>
          {quickLinks.map((link, index) => (
            <QuickLinkCard key={index} color={link.color}>
              <link.icon size={28} />
              <h3>{link.title}</h3>
              <p>{link.description}</p>
            </QuickLinkCard>
          ))}
        </QuickLinksGrid>
      </Section>

      {/* Popular Topics (FAQs) */}
      <Section>
        <SectionTitle>Popular Topics</SectionTitle>
        <FAQContainer>
          {faqs.map((faq, index) => (
            <FAQItem key={index}>
              <FAQQuestion onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}>
                <span>{faq.question}</span>
                {expandedFAQ === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </FAQQuestion>
              {expandedFAQ === index && (
                <FAQAnswer>{faq.answer}</FAQAnswer>
              )}
            </FAQItem>
          ))}
        </FAQContainer>
      </Section>

      {/* Safety Tips & Grounding */}
      <Section>
        <SectionTitle>Safety Tips & Grounding</SectionTitle>
        <TipsGrid>
          <TipCard>
            <div className="icon"><Shield size={24} /></div>
            <h4>Immediate Grounding</h4>
            <p>Use the 5-4-3-2-1 technique: Acknowledge 5 things you see, 4 you can touch, 3 you hear, 2 you can smell, and 1 you can taste.</p>
          </TipCard>
          <TipCard>
            <div className="icon"><LifeBuoy size={24} /></div>
            <h4>Box Breathing</h4>
            <p>Inhale for 4 seconds, hold for 4, exhale for 4, and hold for 4. Repeat until you feel calmer.</p>
          </TipCard>
          <TipCard>
            <div className="icon"><MessageCircle size={24} /></div>
            <h4>Reach Out</h4>
            <p>Don't face this alone. Call a trusted friend, a family member, or one of the helplines listed above.</p>
          </TipCard>
        </TipsGrid>
      </Section>

      {/* Contact Form */}
      <Section>
        <SectionTitle>Still need help? Contact us</SectionTitle>
        <ContactFormCard>
          <form onSubmit={handleSubmitContact}>
            <FormGroup>
              <label>Subject</label>
              <input
                type="text"
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                placeholder="What do you need help with?"
                required
              />
            </FormGroup>

            <FormGroup>
              <label>Priority</label>
              <select
                value={contactForm.priority}
                onChange={(e) => setContactForm({ ...contactForm, priority: e.target.value })}
              >
                <option value="low">Low - General inquiry</option>
                <option value="medium">Medium - Need assistance</option>
                <option value="high">High - Urgent issue</option>
              </select>
            </FormGroup>

            <FormGroup>
              <label>Message</label>
              <textarea
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Describe your issue or question in detail..."
                rows={6}
                required
              />
            </FormGroup>

            <SubmitButton type="submit" disabled={formSubmitted}>
              <Send size={18} />
              {formSubmitted ? 'Message Sent!' : 'Send Message'}
            </SubmitButton>
          </form>

          <ContactInfo>
            <p><Mail size={16} /> <strong>Email:</strong> support@healixai.com</p>
            <p><MessageCircle size={16} /> <strong>Response Time:</strong> Within 24 hours</p>
          </ContactInfo>
        </ContactFormCard>
      </Section>

      <Section>
        <SectionTitle>Resources</SectionTitle>
        <ResourceLinks>
          <ResourceLink>Privacy Policy</ResourceLink>
          <ResourceLink>Terms of Service</ResourceLink>
          <ResourceLink>Community Guidelines</ResourceLink>
          <ResourceLink>API Documentation</ResourceLink>
        </ResourceLinks>
      </Section>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  height: 100%;
  overflow-y: auto;
  background-color: #ffffff;
  color: #111827;
  padding: 40px 20px 80px;
  font-family: \'Outfit\', \'Inter\', sans-serif;
  position: relative;

  /* Custom Scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #ffffff;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(129, 140, 248, 0.2);
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(129, 140, 248, 0.4);
  }
`;

const Header = styled.div`
  max-width: 1200px;
  margin: 0 auto 60px;
`;

const EmergencySection = styled.div`
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.02) 100%);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 24px;
  padding: 40px;
  margin-bottom: 60px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    padding: 30px;
  }

  .content {
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(239, 68, 68, 0.15);
      color: #f87171;
      padding: 6px 14px;
      border-radius: 100px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      margin-bottom: 20px;
    }

    h2 {
      font-size: 2.25rem;
      font-weight: 800;
      margin-bottom: 16px;
      color: #111827;
    }

    p {
      color: #4b5563;
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 32px;
      max-width: 500px;
    }
  }
`;

const SOSButtonWrapper = styled.div`
  position: relative;
  width: fit-content;
`;

const SOSButton = styled.button`
  background: #ef4444;
  color: #111827;
  border: none;
  padding: 20px 40px;
  border-radius: 100px;
  font-size: 1.1rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  z-index: 2;

  &:hover {
    background: #dc2626;
    transform: scale(1.05);
    box-shadow: 0 10px 30px rgba(239, 68, 68, 0.4);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const PulseCircle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: #ef4444;
  border-radius: 100px;
  z-index: 1;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.8;
    }
    100% {
      transform: translate(-50%, -50%) scale(1.4);
      opacity: 0;
    }
  }
`;

const HelplineGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const HelplineCard = styled.div`
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.03);
  padding: 20px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  .name {
    font-size: 0.9rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 4px;
  }

  .number {
    font-size: 1.25rem;
    font-weight: 800;
    color: #ef4444;
    margin-bottom: 4px;
  }

  .desc {
    font-size: 0.75rem;
    color: #9ca3af;
  }
`;

const BackButton = styled.button`
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.08);
  color: #111827;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 30px;

  &:hover {
    background: rgba(0, 0, 0, 0.08);
    transform: translateX(-2px);
  }
`;

const HeroSection = styled.div`
  text-align: center;
  padding: 40px 20px;

  h1 {
    font-size: 3rem;
    margin-bottom: 15px;
    background: linear-gradient(135deg, #818cf8 0%, #ec4899 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 800;
  }

  p {
    color: #4b5563;
    font-size: 1.2rem;
    margin-bottom: 40px;
  }
`;

const SearchBar = styled.div`
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  padding: 0 20px;
  transition: all 0.3s;

  &:focus-within {
    border-color: #818cf8;
    background: rgba(129, 140, 248, 0.05);
    box-shadow: 0 0 0 4px rgba(129, 140, 248, 0.1);
  }

  .search-icon {
    color: #9ca3af;
    margin-right: 12px;
  }

  input {
    background: none;
    border: none;
    color: #111827;
    padding: 16px 0;
    width: 100%;
    font-size: 1rem;

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: #9ca3af;
    }
  }
`;

const Section = styled.div`
  max-width: 1200px;
  margin: 0 auto 80px;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 30px;
  color: #111827;
`;

const QuickLinksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
`;

const QuickLinkCard = styled.div<{ color: string }>`
  background: rgba(0, 0, 0, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.03);
  border-radius: 16px;
  padding: 32px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.06);
    border-color: ${props => props.color}40;
    box-shadow: 0 10px 30px ${props => props.color}20;
  }

  svg {
    color: ${props => props.color};
    margin-bottom: 16px;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 8px;
  }

  p {
    color: #6b7280;
    font-size: 0.95rem;
    line-height: 1.6;
  }
`;

const FAQContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FAQItem = styled.div`
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.03);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;

  &:hover {
    background: rgba(0, 0, 0, 0.03);
  }
`;

const FAQQuestion = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1.05rem;
  transition: all 0.2s;

  &:hover {
    color: #818cf8;
  }

  svg {
    color: #9ca3af;
    flex-shrink: 0;
  }
`;

const FAQAnswer = styled.div`
  padding: 0 24px 24px;
  color: #4b5563;
  line-height: 1.7;
  font-size: 0.95rem;
  animation: slideDown 0.3s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ContactFormCard = styled.div`
  background: rgba(0, 0, 0, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.03);
  border-radius: 16px;
  padding: 40px;
  max-width: 700px;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;

  label {
    display: block;
    font-size: 0.9rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  input, select, textarea {
    width: 100%;
    background: rgba(0, 0, 0, 0.03);
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    padding: 14px 16px;
    color: #111827;
    font-size: 1rem;
    font-family: inherit;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: #818cf8;
      background: rgba(129, 140, 248, 0.05);
    }

    &::placeholder {
      color: #9ca3af;
    }
  }

  textarea {
    resize: vertical;
  }

  select {
    cursor: pointer;
  }
`;

const SubmitButton = styled.button`
  background: #818cf8;
  color: #111827;
  border: none;
  padding: 14px 32px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #6366f1;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
  }

  &:disabled {
    background: #4ade80;
    cursor: not-allowed;
  }
`;

const ContactInfo = styled.div`
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 12px;

  p {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #4b5563;
    font-size: 0.95rem;

    svg {
      color: #818cf8;
    }
  }
`;

const ResourceLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

const ResourceLink = styled.a`
  color: #818cf8;
  text-decoration: none;
  font-weight: 600;
  padding: 12px 24px;
  background: rgba(129, 140, 248, 0.1);
  border: 1px solid rgba(129, 140, 248, 0.2);
  border-radius: 12px;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background: rgba(129, 140, 248, 0.2);
    transform: translateY(-2px);
  }
`;

const TipsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
`;

const TipCard = styled.div`
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.03);
  border-radius: 20px;
  padding: 32px;
  transition: all 0.3s;

  &:hover {
    background: rgba(0, 0, 0, 0.03);
    border-color: rgba(129, 140, 248, 0.2);
    transform: translateY(-4px);
  }

  .icon {
    width: 48px;
    height: 48px;
    background: rgba(129, 140, 248, 0.1);
    color: #818cf8;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }

  h4 {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 12px;
    color: #111827;
  }

  p {
    color: #6b7280;
    font-size: 0.95rem;
    line-height: 1.6;
  }
`;

export default HelpSupportPage;
