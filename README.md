# React + Vite
Onion — A Gemini Clone built with React
A modern Gemini protocol client inspired by the feel of Gemini browsers, built with React. Lightweight, fast, and simple to navigate.

Table of Contents
Overview
Features
Getting Started
Prerequisites
Installation
Running Locally
Building for Production
Usage
Basic Navigation
Commands & Shortcuts
Architecture
Components
State Management
Styling
Networking & Gemini Protocol
Accessibility
Testing
Performance
Security
Contribution
Roadmap
Changelog
License
Acknowledgments
Contact
Overview
Onion is a lightweight Gemini client implemented in React. It aims to provide a clean, fast, and distraction-free browsing experience for Gemini capsules. It supports basic fetch, navigation, bookmarking, and a simple reader mode.

Tech stack: React, Vite (or Create React App), TypeScript (optional), CSS Modules / Styled Components, and a minimal Gemini fetch layer.
Goals: Speed, accessibility, and a pleasant reading experience.
Features
Gemini protocol support (text/gemini, gemini:// URLs)
Client-side routing and navigation
Bookmarks / Favorites
Simple reader mode
Offline caching (optional)
Responsive UI (mobile and desktop)
Theming (light/dark)
Getting Started
Prerequisites
Node.js >= 14 (or the minimum supported by your chosen tooling)
npm or yarn
Git
Installation
Clone the repository

bash
git clone https://github.com/iam-johnhardy/onion-onion-clone.git
cd onion-onion-clone
Install dependencies

bash
npm install
# or
yarn install
Running Locally
Development server

bash
npm run dev
# or
yarn dev
The app should be available at http://localhost:5173 (or the configured port).
TypeScript (if used)

Type checking:
bash
npm run type-check
Building for Production
Build
bash
npm run build
Preview
bash
npm run preview
Usage
Basic Navigation
Enter a Gemini URL (gemini:// or gemini:text) in the address bar.
Use the back/forward buttons to navigate history.
Open bookmarks from the sidebar or menu.
Commands & Shortcuts
Ctrl/Cmd + K - Quick search or command palette
Ctrl/Cmd + F - Find in page
Ctrl/Cmd + R - Refresh
Ctrl/Cmd + B - Toggle bookmarks
Customize these shortcuts in the settings file if you implement a settings UI.

Architecture
Frontend: React + TypeScript
Routing: React Router (or your preferred router)
State Management: React Context + useReducer (or Redux/Zustand if preferred)
Gemini Layer: A lightweight module to fetch Gemini pages and parse their content into renderable React components
Styling: CSS Modules / Styled Components / Tailwind (choose one)
Build Tooling: Vite / Webpack
Diagram (textual):

App
Components
Pages
GeminiService
Cache/Storage
Settings
Components
AppShell - Global layout (header, footer, sidebar)
Navigator - URL input, navigation controls
ContentView - Renders Gemini content as React components
BookmarkList - Manage bookmarks
ReaderMode - Clean reading view
SettingsPanel - User preferences
ErrorBoundary - Graceful error handling
State Management
Global state (Context)
currentURL
history (back/forward)
bookmarks
theme
readerMode
networkStatus
Local component state for UI controls
APIs:

GeminiService.fetch(url) - Fetch and parse Gemini content
StorageService.get/set - Persist bookmarks and settings to localStorage or IndexedDB
Styling
Theme: Light and dark modes
Responsive breakpoints (mobile, tablet, desktop)
Accessibility-friendly color contrast
CSS Variables for theming
Networking & Gemini Protocol
Gemini protocol basics:
gemini:// URLs
Text/ Gemini content is rendered as plain text with simple formatting
Gemini fetch layer:
Handles TLS, redirects, and basic error handling
Graceful fallback if a Gemini page is not reachable
Security considerations:
Validate and sanitize content before rendering
Handle mixed content securely
Note: In the browser, Gemini is typically proxied via a gateway or a dedicated fetch layer since Gemini usually uses its own protocol over TCP. If Onion uses a gateway service, document that here with details about privacy and data handling.

Accessibility
Semantic HTML elements
ARIA roles where appropriate
Focus management after navigation
Keyboard navigable controls
Color contrast checks
Testing
Unit tests: Jest / Vitest
Component tests: React Testing Library
E2E tests: Playwright / Cypress
Linting and formatting: ESLint + Prettier
Test commands (example):

npm test
npm run test:ui
npm run e2e
Performance
Code-splitting and lazy loading for Gemini pages
Caching Gemini responses for offline use
Image optimization where applicable
Measuring and optimizing initial paint time (FCP)
Security
Sanitize all Gemini content before rendering
Avoid inline scripts; render content in a safe container
Use Content Security Policy (CSP)
Regular dependency updates and vulnerability scans
Contribution
We welcome contributions! Please follow these steps:

Fork the repository
Create a feature branch: git checkout -b feat/awesome-feature
Commit changes with clear messages
Open a pull request with a summary of changes
Run tests and ensure they pass
