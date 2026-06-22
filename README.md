# Chatsync Pro

A modern chat application built with TypeScript and React.

## Project Structure

```
Chatsync-pro/
├── src/
│   ├── components/
│   │   ├── ActivityChart.tsx          # Activity visualization component
│   │   ├── ChatArea.tsx               # Main chat display area
│   │   ├── CommandPalette.tsx         # Command palette interface
│   │   ├── Login.tsx                  # Login/authentication component
│   │   ├── MessageInput.tsx           # Message input field component
│   │   ├── MessageItem.tsx            # Individual message display component
│   │   ├── MessageList.tsx            # Message list container
│   │   ├── ProfilePanel.tsx           # User profile panel
│   │   ├── Settings.tsx               # Settings/configuration component
│   │   ├── Sidebar.tsx                # Navigation sidebar
│   │   └── ThreadPanel.tsx            # Thread view panel
│   │
│   ├── context/
│   │   └── ChatContext.tsx            # Global chat state management
│   │
│   ├── lib/
│   │   ├── mockData.ts                # Mock data for development/testing
│   │   └── utils.ts                   # Utility functions
│   │
│   ├── App.tsx                        # Root application component
│   ├── main.tsx                       # Application entry point
│   ├── types.ts                       # TypeScript type definitions
│   └── index.css                      # Global styles
│
├── assets/
│   └── .aistudio/                     # AI Studio related assets
│
├── public/
│   └── index.html                     # HTML template
│
├── Configuration Files
│   ├── package.json                   # Project dependencies and scripts
│   ├── package-lock.json              # Locked dependency versions
│   ├── tsconfig.json                  # TypeScript configuration
│   ├── vite.config.ts                 # Vite build tool configuration
│   ├── .env.example                   # Environment variables template
│   ├── .gitignore                     # Git ignore rules
│   └── metadata.json                  # Project metadata

```

## Directory Overview

### `/src`
Main source code directory containing all application logic and components.

### `/src/components`
Reusable React components for the chat interface:
- **UI Components**: ChatArea, MessageList, Sidebar, CommandPalette
- **Input Components**: MessageInput, Login
- **Display Components**: MessageItem, ProfilePanel, ThreadPanel, ActivityChart
- **Settings**: Settings component for user preferences

### `/src/context`
React Context API implementation for global state management, specifically handling chat-related state.

### `/src/lib`
Utility functions and mock data:
- Helper functions for common operations
- Mock data for development and testing purposes

### `/assets`
Static assets and studio-related files.

## Technology Stack

- **Language**: TypeScript (99.6%)
- **Framework**: React
- **Build Tool**: Vite
- **Styling**: CSS

## Configuration

- `tsconfig.json` - TypeScript compiler options
- `vite.config.ts` - Vite development server and build configuration
- `.env.example` - Environment variables template
- `package.json` - Project metadata, dependencies, and scripts

---

*Last updated: 2026-06-22*
