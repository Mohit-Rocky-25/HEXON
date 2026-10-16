/**
 * Repo Pilot Workplace - State Store & LocalStorage Persistence
 */

const DEFAULT_STATE = {
  workplaceName: "Repo Pilot Workplace",
  currentView: "dashboard",
  theme: "default",
  metrics: {
    activeTasks: 14,
    velocityRate: "94.2%",
    teamOnline: 8,
    docsCount: 12
  },
  tasks: [
    {
      id: "task-1",
      title: "Initialize Repo Pilot Core Architecture",
      desc: "Establish scalable modular foundation, state store, and glassmorphic UI tokens.",
      column: "done",
      priority: "urgent",
      assignee: "Alex Rivera",
      assigneeInitials: "AR"
    },
    {
      id: "task-2",
      title: "Design Interactive Sprint Board",
      desc: "Implement drag/move state transitions, priority badges, and quick-filter bar.",
      column: "progress",
      priority: "high",
      assignee: "Sarah Chen",
      assigneeInitials: "SC"
    },
    {
      id: "task-3",
      title: "Team Realtime Chat Channels",
      desc: "Connect multi-channel messaging (#general, #engineering, #design) with smart AI response simulation.",
      column: "progress",
      priority: "medium",
      assignee: "Marcus Vance",
      assigneeInitials: "MV"
    },
    {
      id: "task-4",
      title: "Knowledge Hub & Live Markdown Docs",
      desc: "Provide unified documentation workspace with auto-save and rich previewing.",
      column: "review",
      priority: "high",
      assignee: "Elena Rostova",
      assigneeInitials: "ER"
    },
    {
      id: "task-5",
      title: "Telemetry & Performance Telemetry",
      desc: "Wire up sprint velocity charts, system uptime pings, and team presence radar.",
      column: "todo",
      priority: "low",
      assignee: "Devon Reed",
      assigneeInitials: "DR"
    }
  ],
  channels: [
    { id: "general", name: "#general", topic: "Workplace announcements and company-wide updates" },
    { id: "engineering", name: "#engineering", topic: "Sprint 24 architecture, pull requests, and systems" },
    { id: "design", name: "#design-system", topic: "UI/UX reviews, glassmorphism tokens, and micro-interactions" }
  ],
  messages: {
    general: [
      { id: "m1", author: "Repo Pilot Bot", initials: "RP", time: "10:14 AM", text: "Welcome to Repo Pilot Workplace. All systems nominal, sprint velocity at 94.2%." },
      { id: "m2", author: "Alex Rivera", initials: "AR", time: "10:20 AM", text: "Team, the new Repo Pilot workspace environment is live. Feel free to log tasks and join the huddle." }
    ],
    engineering: [
      { id: "m3", author: "Sarah Chen", initials: "SC", time: "11:05 AM", text: "Branch for Sprint Board transitions is merged. Ready for QA review." },
      { id: "m4", author: "Marcus Vance", initials: "MV", time: "11:12 AM", text: "Verified! Responsive layouts and glassmorphism look exceptionally crisp." }
    ],
    design: [
      { id: "m5", author: "Elena Rostova", initials: "ER", time: "09:30 AM", text: "Updated cyber-cyan and electric-violet gradients for dark mode." }
    ]
  },
  docs: [
    {
      id: "doc-1",
      title: "Repo Pilot Workplace Architecture & Specs",
      category: "Architecture",
      content: `# Repo Pilot Workplace Architecture Specification

## Overview
Repo Pilot is a unified collaborative workplace platform engineered for high-velocity teams.

### Core Modules
1. **Command Dashboard**: Live telemetry, sprint tracking, and activity feed.
2. **Interactive Sprint Kanban**: Multi-column task workflow with dynamic priority tags.
3. **Team Channels & Chat**: Real-time mock communications with smart bots.
4. **Knowledge Hub**: Live docs with instant markdown rendering.
5. **Team Presence Radar**: Live focus and status indicators.`
    },
    {
      id: "doc-2",
      title: "Design System Guidelines & Tokens",
      category: "Design",
      content: `# Design System Guidelines

- **Background**: Deep Obsidian (#07090e / #0b0f19)
- **Primary Glow**: Cyan (#00f2fe)
- **Secondary Accent**: Electric Violet (#8a2be2)
- **Glass Panel Blur**: 12px backdrop-filter with 7% white borders`
    }
  ],
  team: [
    { id: "t1", name: "Alex Rivera", role: "Principal Architect", status: "Coding Core Services", state: "online", initials: "AR" },
    { id: "t2", name: "Sarah Chen", role: "Staff Frontend Lead", status: "Reviewing UI Components", state: "online", initials: "SC" },
    { id: "t3", name: "Elena Rostova", role: "Lead Product Designer", status: "In UX Wireframe Sync", state: "meeting", initials: "ER" },
    { id: "t4", name: "Marcus Vance", role: "Full-Stack Engineer", status: "Refactoring API Endpoints", state: "online", initials: "MV" },
    { id: "t5", name: "Devon Reed", role: "DevOps & Cloud Lead", status: "Monitoring Infrastructure", state: "focus", initials: "DR" },
    { id: "t6", name: "Aria Thorne", role: "Product Manager", status: "Sprint Planning", state: "away", initials: "AT" }
  ]
};

class Store {
  constructor() {
    const saved = localStorage.getItem("REPO_PILOT_STATE") || localStorage.getItem("HEXON_STATE");
    this.state = saved ? JSON.parse(saved) : DEFAULT_STATE;
    // Ensure workplaceName is updated if migrated from legacy storage
    if (this.state && (this.state.workplaceName === "HEXON Workplace" || !this.state.workplaceName)) {
      this.state.workplaceName = "Repo Pilot Workplace";
    }
  }

  save() {
    localStorage.setItem("REPO_PILOT_STATE", JSON.stringify(this.state));
  }

  getState() {
    return this.state;
  }

  addTask(task) {
    this.state.tasks.unshift(task);
    this.save();
  }

  moveTask(taskId, newColumn) {
    const task = this.state.tasks.find(t => t.id === taskId);
    if (task) {
      task.column = newColumn;
      this.save();
    }
  }

  deleteTask(taskId) {
    this.state.tasks = this.state.tasks.filter(t => t.id !== taskId);
    this.save();
  }

  addMessage(channelId, message) {
    if (!this.state.messages[channelId]) {
      this.state.messages[channelId] = [];
    }
    this.state.messages[channelId].push(message);
    this.save();
  }

  addDoc(doc) {
    this.state.docs.unshift(doc);
    this.save();
  }

  updateDoc(docId, title, content) {
    const doc = this.state.docs.find(d => d.id === docId);
    if (doc) {
      doc.title = title;
      doc.content = content;
      this.save();
    }
  }

  setTheme(themeName) {
    this.state.theme = themeName;
    this.save();
  }
}

window.repoPilotStore = new Store();
window.hexonStore = window.repoPilotStore; // Backwards compatibility
