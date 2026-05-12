<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Healix AI - Your Mental Wellness Companion 🧠✨

Healix AI is a powerful, full-stack mental health application designed to provide emotional support, track user moods, and offer personalized insights. Built with a focus on both aesthetics and functionality, it serves as a supportive companion for your mental well-being journeys.

---

## 🌟 What's in this Application? (Features)

Healix AI is more than just a chatbot; it's a complete ecosystem for mental wellness:

### 1. **Empathetic AI Chat** 💬
   - Context-aware conversations powered by the **Gemma AI model**.
   - Supports both **Text and Voice** interactions.
   - **Memory Intelligence**: Recalls past interactions for personalized support.

### 2. **Real-time Mood & Emotion Tracking** 📊
   - Advanced sentiment analysis of your chat messages.
   - Voice and facial emotion recognition (integrated mocks).
   - Visual dashboard for tracking your emotional trends over time.

### 3. **Smart Reminders & Planning** ⏰
   - A dedicated **Reminders Page** to help you stay on track with healthy habits.
   - Daily overview of your activities and goals.

### 4. **Safety & Crisis Support** 🛡️
   - Intelligent crisis detection that provides immediate access to helpline resources.
   - Built-in intervention logic for high-risk inputs.

### 5. **Premium Aesthetic Dashboard** 🎨
   - Sleek, modern design with dark theme/glassmorphism for a calming experience.
   - Fully responsive for access on mobile, tablet, and desktop.

### 6. **Comprehensive History** 📅
   - View your previous conversations and mood progress through a functional calendar interface.

---

## 📥 What to Download/Install?

To run Healix AI locally, you need the following prerequisites installed on your system:

1. **Python (v3.9 or higher)**: For the backend server.
   - [Download Python](https://www.python.org/downloads/)
2. **Node.js (v18 or higher)** & **npm**: For the frontend application.
   - [Download Node.js](https://nodejs.org/)
3. **Git**: To clone and manage the repository.
   - [Download Git](https://git-scm.com/)

---

## 🚀 How to Run the Application?

We have provided easy scripts to get everything running quickly!

### **Option 1: Quick Start (Recommended)**
1. **Double-click `start_app.bat`** in the root folder.
2. This script automatically:
   - Sets up a Python virtual environment (`.venv`).
   - Installs all Backend (Python) and Frontend (npm) dependencies.
   - Launches both servers simultaneously.

### **Option 2: Running the Servers**
If you have already installed dependencies, simply run:
1. **Double-click `run_app.bat`** to start the development servers.
2. **Frontend**: [http://localhost:5173](http://localhost:5173)
3. **Backend**: [http://localhost:8003](http://localhost:8003)

### **Option 3: Manual Startup**
**Backend:**
```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn app.main:app --port 8003 --reload
```

**Frontend:**
```bash
cd frontend/web
npm install
npm run dev
```

---

## 🌍 Network Access
Want to use it on your phone? 
1. Ensure your PC and phone are on the same Wi-Fi.
2. Find your PC's IP address (run `ipconfig` in CMD on Windows).
3. Open `http://<YOUR_IP_ADDRESS>:5173` on your phone's browser!

---

**Note**: Secure your environment variables in `backend/.env` for API keys and database configurations.
