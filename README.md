# 🐾 LilPaws AI - Smart Pet Adoption Platform

LilPaws is a modern, AI-powered pet adoption ecosystem designed to streamline the connection between rescued animals and loving homes. It leverages Artificial Intelligence to pre-screen adoption applications, ensuring pets are matched with the most suitable environments.

## 🌟 Key Features

### 🐶 For Users
- **Smart Pet Discovery**: Browse and search for pets available for adoption.
- **Digital Adoption Form**: Comprehensive multi-step application process with validated criteria.
- **Live Status Tracking**: Monitor application progress from "AI Review" to "Final Decision" in real-time.
- **Report Strays**: Community-driven reporting to help animals in need find nearest shelters.
- **E-commerce Hub**: Comprehensive shop for pet supplies with integrated payments.

### 🛡️ For Shelter Admins
- **AI-Assisted Screening**: Automated review of applications using Google Gemini AI.
- **Flexible Assessment Modes**:
  - **Autonomous Mode**: AI handles the primary filtering and initial verdicts.
  - **Manual Oversight**: Admins review AI-flagged applications for final confirmation.
- **Real-Time Dashboard**: Live-synced inbox for pending applications without page refreshes.
- **Multi-Shelter Management**: Dedicated controls for Chandigarh, Panchkula, and Mohali facilities.

---

## 🏗️ Technical Architecture

The project follows a microservices-inspired architecture:

### 1. Frontend (`/client`)
- **Framework**: React.js with Vite
- **Styling**: Tailwind CSS & Shadcn UI
- **State Management**: Redux Toolkit
- **Icons/UI**: Lucide React & Framer Motion

### 2. Primary Backend (`/server`)
- **Runtime**: Node.js & Express
- **Database**: MongoDB (Mongoose ODM)
- **Cache/Queue**: Redis (ioredis)
- **Cloud Storage**: Cloudinary (Image management)
- **Payments**: PayPal SDK

### 3. AI Review Service (`/ai-review-service`)
- **Framework**: Python FastAPI
- **LLM Engine**: LangChain + Google Gemini Pro
- **Worker**: Asynchronous background processing of adoption queues.
- **Database**: Motor (Async MongoDB Driver)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.9+)
- Redis Server
- MongoDB (Local or Atlas)
- Google Gemini API Key

### Environmental Setup

1. **Server (`server/.env`)**:
   ```env
   MONGODB_URL=your_mongodb_uri
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=your_secret
   CLOUDINARY_CLOUD_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   ```

2. **AI Service (`ai-review-service/.env`)**:
   ```env
   MONGODB_URL=your_mongodb_uri
   REDIS_URL=redis://localhost:6379
   GEMINI_API_KEY=your_gemini_key
   ```

### Installation & Execution

**Step 1: Start the Backend Server**
```bash
cd server
npm install
npm run dev
```

**Step 2: Start the AI Service**
```bash
cd ai-review-service
pip install -r requirements.txt
python main.py
```

**Step 3: Start the Frontend**
```bash
cd client
npm install
npm run dev
```

---

## 🧪 Seeding Data
To populate the application with default shelters and pets:
1. Run `node seedShelters.js` in the `server` directory.
2. The initial admin creation is available via the internal UI path: `/auth/register-shelter-admin`.

---

## 📄 License
ISC License - Built with ❤️ for animals.