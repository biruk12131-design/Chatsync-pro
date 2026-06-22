# ChatSync Pro

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwind-css)
![Socket.io](https://img.shields.io/badge/Socket.io-real‑time-010101?logo=socket.io)
![Lighthouse](https://img.shields.io/badge/Lighthouse-95%2B-brightgreen)

A real‑time team messaging app inspired by Slack/Discord, built entirely with mock data and simulated real‑time events. No real backend required – all interactions happen client‑side to give the illusion of live chat.

🚀 Live Demo

https://chatsync-pro.vercel.app/

✨ Features

· Channels & Direct Messages – 4 channels, 6 user DMs.
· Real‑Time Simulation – Messages appear instantly, simulated incoming replies.
· Typing Indicator – Shows when a user is typing.
· Read Receipts – Double‑check after 3 seconds.
· Message Search – Filter by text.
· User Profile Panel – Click avatar to see details.
· Dark/Light Theme – Persisted toggle.
· Collapsible Sidebar – Mobile‑friendly.
· Accessible – Keyboard navigation, ARIA labels.

🛠 Tech Stack

· Framework: Next.js 14 (App Router)
· Language: TypeScript
· Styling: Tailwind CSS
· Real‑Time Simulation: setInterval, useEffect, local state
· Icons: lucide-react
· Deployment: Vercel


## Project Structure

chatsync-pro/

├── src/

│   ├── app/                         # Next.js App Router

│   │   ├── layout.tsx               # Root layout

│   │   ├── page.tsx                 # Home page

│   │   └── globals.css              # Global styles (Tailwind)

│   │

│   ├── components/

│   │   ├── ActivityChart.tsx        # Activity visualization component

│   │   ├── ChatArea.tsx             # Main chat display area

│   │   ├── CommandPalette.tsx       # Command palette interface

│   │   ├── Login.tsx                # Login/authentication component

│   │   ├── MessageInput.tsx         # Message input field component

│   │   ├── MessageItem.tsx          # Individual message display component

│   │   ├── MessageList.tsx          # Message list container

│   │   ├── ProfilePanel.tsx         # User profile panel

│   │   ├── Settings.tsx             # Settings/configuration component

│   │   ├── Sidebar.tsx              # Navigation sidebar

│   │   └── ThreadPanel.tsx          # Thread view panel

│   │
│   ├── context/
│   │   └── ChatContext.tsx          # Global chat state management

│   │
│   ├── lib/
│   │   ├── mockData.ts              # Mock data for development/testing

│   │   └── utils.ts                 # Utility functions

│   │
│   └── types.ts                     # TypeScript type definitions

│
├── public/                          # Static assets

│   └── (images, icons, etc.)

│
├── Configuration Files
│   ├── package.json

│   ├── package-lock.json

│   ├── tsconfig.json

│   ├── next.config.mjs              # Next.js configuration

│   ├── tailwind.config.ts           # Tailwind CSS configuration

│   ├── postcss.config.mjs           # PostCSS configuration

│   ├── .env.example

│   ├── .gitignore

│   └── metadata.json

```

📸 Screenshot

https://placehold.co/800x500?text=ChatSync+Pro

🚦 Getting Started

```bash
git clone https://github.com/birukdev12-senior/chatsync-pro.git
cd chatsync-pro
npm install
npm run dev
