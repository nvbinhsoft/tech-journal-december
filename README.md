# Tech Journal Monorepo

A modern technical blog platform built with a serverless architecture, featuring a React frontend and an AWS Lambda backend.

## 🏗 Architecture

This project is a monorepo managed with npm workspaces:

- **Frontend** (`packages/frontend`): A Single Page Application (SPA) built with React, Vite, TailwindCSS, and shadcn/ui.
- **Backend** (`packages/backend-serverless`): A generic Serverless API built with Node.js, AWS Lambda, API Gateway, and MongoDB (Mongoose).

## ✨ Features

- **Store-backed State Management**: Uses Zustand for robust global state management.
- **Serverless API**: Cost-effective and scalable backend using AWS Lambda.
- **Admin Dashboard**: Secure admin area for managing content.
- **Markdown Editor**: Rich text editing experience for articles.
- **Audit Logging**: Tracks visitor history (IP, Referrer, User Agent) with admin visualization.
- **Tag Management**: Organize content with a flexible tagging system.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas (or local MongoDB)
- AWS Credentials (for deployment)

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create `.env` files in both packages:

**packages/backend-serverless/.env**:
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
```

**packages/frontend/.env**:
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_MOCK_DATA=false
```

### 3. Run Locally

You can run both services concurrently:

**Backend (Offline Mode):**
```bash
cd packages/backend-serverless
npm run offline
```
*Runs on http://localhost:3000*

**Frontend:**
```bash
cd packages/frontend
npm run dev
```
*Runs on http://localhost:5173*

## 📦 Deployment

### Backend

Deploy to AWS using Serverless Framework:

```bash
cd packages/backend-serverless
npm run deploy
```

### Frontend

Build and deploy to your hosting provider (e.g., Vercel, Netlify, or AWS S3/CloudFront):

```bash
cd packages/frontend
npm run build
```

## 🛠 Tech Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS, Lucide Icons, Shadcn UI.
- **Backend**: Node.js, Serverless Framework, AWS Lambda, MongoDB, Mongoose.
- **Tools**: ESLint, Prettier, TypeScript.
