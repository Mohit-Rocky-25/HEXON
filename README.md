# Repo Pilot Workplace 🪐

> Next-Generation Collaborative Operating Hub & Digital Workplace

Repo Pilot Workplace is a modern, high-velocity digital workplace engineered with sleek cyber-obsidian glassmorphism, instant local reactivity, and unified telemetry.

![Repo Pilot Workplace Banner](assets/repo_pilot_banner.jpg)

---

## 🌟 Features

- **🚀 Command Dashboard**: Real-time sprint telemetry, workload velocity graphs, team presence indicators, and live activity streams.
- **📋 Sprint Task Board (Kanban)**: Interactive columns (*Backlog*, *In Progress*, *Code Review*, *Completed*) with dynamic priority chips (*Urgent*, *High*, *Medium*, *Low*), left/right task movers, and task creation modal.
- **💬 Team Channels & Live Chat**: Instant messaging across dedicated channels (`#general`, `#engineering`, `#design-system`) with simulated automated bot responses.
- **📝 Knowledge Hub & Live Docs**: Built-in team documentation editor with persistent auto-save and markdown preview.
- **👥 Team Radar & Directory**: Real-time status indicators (🟢 Online, 🟡 Standup, 🟣 Focus, ⚪ Away) with direct messaging links.
- **🎨 Glassmorphic Themes**: Switchable themes including Cyber Cyan (Default), Electric Violet, and Emerald Cyber.
- **⚡ Zero Configuration**: Pure modern HTML5, CSS3 Custom Properties, and modular Vanilla JS with LocalStorage persistence.

---

## 📁 Project Architecture

```
REPO PILOT/
├── .vscode/
│   ├── settings.json          # Workspace format & editor preferences
│   └── extensions.json        # Recommended IDE extensions
├── assets/
│   ├── repo_pilot_logo.jpg    # Custom 3D brand emblem
│   └── repo_pilot_banner.jpg  # Cyber command center hero visual
├── scripts/
│   ├── store.js               # Reactive state manager & LocalStorage persistence
│   └── app.js                 # UI controllers, modal dialogs & chat bot logic
├── styles/
│   └── main.css               # Design tokens, cyber obsidian glassmorphism & responsive grid
├── REPO_PILOT.code-workspace  # VS Code / Antigravity workspace definition
├── index.html                 # Main application interface
├── package.json               # Project manifest & npm scripts
└── README.md                  # Workplace documentation
```

---

## 🚀 Getting Started

### 1. Open with Browser
Simply double-click `index.html` or open it with your favorite browser:
```powershell
Start-Process "index.html"
```

### 2. Run with Dev Server (Optional)
Run using Node.js / npx:
```powershell
npm run dev
# Or: npx serve -l 3000 .
```

### 3. Open as VS Code / Antigravity Workspace
You can open this project directly in your editor via:
- `REPO_PILOT.code-workspace`
- Or `File -> Open Folder`

---

## ⚙️ Keyboard Shortcuts
- `Ctrl + K`: Quick Focus Global Workplace Search

---

## 🛡️ License
MIT License. Built for high-velocity teams.
