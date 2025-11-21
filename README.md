# Real-Time Voice Call Translation

This is a full-stack web application that provides real-time voice call translation. It allows multiple users to join a voice call and speak in their native languages, and the application will translate their speech to the other users' preferred languages in real-time.

## Features

- **Real-time voice translation:** Speak in any language and have your voice translated to other participants' preferred languages in real-time.
- **Multi-user calls:** Supports group calls with multiple participants.
- **Live subtitles:** Displays live subtitles of the translated speech.
- **Language selection:** Each user can select their preferred language for translation.
- **WebRTC-based:** Uses WebRTC for low-latency, peer-to-peer voice streaming.
- **AI-powered:** Integrates with AI services for speech-to-text, translation, and text-to-speech.

## Tech Stack

**Frontend:**
- React + TypeScript
- TailwindCSS
- WebRTC
- Socket.IO Client

**Backend:**
- Node.js + Express + TypeScript
- Socket.IO
- Gemini API (or other AI services) for translation

## Project Structure

- `/frontend`: The React frontend application.
- `/backend`: The Node.js backend server.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, or pnpm

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo/real-time-voice-translation.git
   cd real-time-voice-translation
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables:**
   - In the `backend` directory, copy the `.env.example` file to a new file named `.env`.
   - Add your API keys for the Gemini API (or other AI services) to the `.env` file.

### Running the Application

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```
   The backend server will start on `http://localhost:3001`.

2. **Start the frontend application:**
   ```bash
   cd ../frontend
   npm run dev
   ```
   The frontend application will start on `http://localhost:5173`.

3. Open your browser and navigate to `http://localhost:5173` to use the application.

## Deployment

### Vercel (Frontend)

The frontend can be easily deployed to Vercel.

1. Create a new project on Vercel and connect it to your Git repository.
2. Set the build command to `npm run build` and the output directory to `dist`.
3. Add the necessary environment variables for the backend URL.

### Render (Backend)

The backend can be deployed to Render.

1. Create a new web service on Render and connect it to your Git repository.
2. Set the build command to `npm run build` and the start command to `node dist/server.js`.
3. Add the necessary environment variables for the AI API keys.

## Performance & Latency Notes

- **AI Service Latency:** The latency of the AI services (speech-to-text, translation, text-to-speech) will be the main bottleneck. Consider using services that are optimized for real-time, low-latency processing.
- **Network Conditions:** The quality of the call and the translation will depend on the network conditions of the participants.
- **Server Location:** Deploy the backend server in a region that is geographically close to the users to minimize network latency.
- **WebRTC TURN Servers:** For users behind restrictive firewalls, you will need to configure TURN servers to relay the WebRTC traffic. This can add to the latency and cost of the application.
