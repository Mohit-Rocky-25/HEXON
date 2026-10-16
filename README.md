# RepoPilot 🪐

> **Open-Source Repository Intelligence, Code Understanding, and Debugging Platform**  
> *Zero-Budget · 100% Local Compute & Public GitHub · GroqCloud Console Aesthetic*

[![CI](https://github.com/your-username/RepoPilot/actions/workflows/ci.yml/badge.svg)](.github/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Budget: ₹0](https://img.shields.io/badge/API_Budget-₹0-success.svg)](docs/architecture/ARCHITECTURE.md)
[![AI: Local Ollama (Optional)](https://img.shields.io/badge/AI-Ollama_(Optional)-violet.svg)](https://ollama.com)

![RepoPilot Banner](assets/repo_pilot_banner.jpg)

---

## 🌟 Mission & Audience

RepoPilot is an open-source developer tool engineered for **CSE students**, **open-source contributors**, and **software engineers** investigating unfamiliar codebases.

When approaching a massive unfamiliar repository, developers often face fragmented documentation, unknown entry points, and confusing runtime errors. RepoPilot provides an evidence-backed console to progressively:
1. **Explore structure & code**: Browse directory trees and inspect files with exact line numbers and commit-pinned references.
2. **Search deterministically**: Instant file, symbol, and keyword search with ranking without requiring AI.
3. **Analyze architecture**: Identify entry points, frameworks, module roles, and package manifests automatically.
4. **Interactive Q&A & Code Intelligence**: Ask questions grounded directly in indexed code files with exact citations (using optional local Ollama models; no paid APIs required).
5. **Investigate bugs & stack traces**: Correlate error logs and stack traces with repository source lines, formulating evidence-backed hypotheses and testable patch proposals.
6. **Export PR drafts & reports**: Generate reproducible bug reports and pull request descriptions ready for review.

---

## 🎨 Visual Reference: GroqCloud Developer Console

RepoPilot adopts the **GroqCloud Developer Console** design language:
- **Obsidian Dark Surfaces**: High information density with monochromatic dark surfaces (`#07090e`, `#0d1117`), crisp 1px borders (`#30363d`), and Terminal Cyan accents (`#00f2fe`).
- **Precision Typography**: Clean UI sans-serif paired with monospace fonts for commit SHAs, line numbers, and symbol signatures.
- **No Fluff**: No decorative placeholder buttons, no fabricated metrics, no fake AI chatbots. Every button and API endpoint performs real work.

---

## ⚡ Zero-Budget Operating Model

| Capability | Strategy | Operating Cost |
| :--- | :--- | :--- |
| **Repository Ingestion** | Public unauthenticated GitHub REST API with rate-limit tracking | **₹0** |
| **Search Engine** | Deterministic in-memory & SQLite FTS5 search indexer | **₹0** |
| **Code Intelligence** | Optional local [Ollama](https://ollama.com) (e.g. `qwen2.5-coder:1.5b`) | **₹0** |
| **Security Sandbox** | Untrusted code execution disabled by default; verified manual reproduction | **₹0** |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.x or v20+
- **npm**: v9+
- (Optional) **Ollama**: For local open-weights coding models

### 1. Installation
```bash
git clone https://github.com/your-username/RepoPilot.git
cd RepoPilot
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 3. Run Verification Tests & Typecheck
```bash
npm run typecheck    # Strict TypeScript verification
npm test             # Run 26 unit & integration tests
npm run build        # Build production Next.js bundle
```

---

## 📁 Architecture & Project Structure

```
RepoPilot/
├── src/
│   ├── app/                         # Next.js App Router (Layouts & Pages)
│   │   ├── page.tsx                 # Home / Quick Import / Starters
│   │   ├── explore/page.tsx         # File Tree & Code Viewer
│   │   ├── search/page.tsx          # Full-Text & Symbol Search
│   │   ├── architecture/page.tsx    # Framework & Entry Point Intelligence
│   │   ├── assistant/page.tsx       # Grounded Q&A Workspace
│   │   ├── debugging/page.tsx       # Stack Trace & Bug Analyzer
│   │   ├── patches/page.tsx         # Candidate Patch Review & PR Export
│   │   ├── settings/page.tsx        # General Settings & Token Quotas
│   │   ├── settings/ai/page.tsx     # Local Ollama Diagnostics
│   │   ├── docs/page.tsx            # Documentation & Limitations
│   │   └── api/                     # Route Handlers (GitHub, Search, AI, Debugging)
│   ├── components/
│   │   ├── layout/                  # ShellLayout, Sidebar, Header
│   │   ├── explorer/                # FileTree
│   │   ├── modals/                  # ImportModal, SearchModal
│   │   └── ui/                      # Button, Badge, Card, Input, CodeViewer
│   ├── context/                     # RepositoryContext (Active Repo & Persistence)
│   └── styles/                      # globals.css (GroqConsole Design Tokens)
├── packages/
│   ├── core/                        # Zod domain schemas, types, contracts
│   ├── github/                      # GitHub API client, tree fetcher, cache
│   ├── indexer/                     # Deterministic symbol extractor (TS/JS/Python/Go)
│   ├── search/                      # Ranked search engine (paths, symbols, text)
│   ├── analysis/                    # ArchitectureAnalyzer & framework detector
│   ├── ai/                          # OllamaClient, prompt builder, citation validator
│   ├── debugging/                   # StackTraceParser & HypothesisEngine
│   └── execution/                   # ExecutionPolicy & manual reproduction plans
├── docs/
│   ├── architecture/                # System Architecture Specifications
│   └── decisions/                   # Architecture Decision Records (ADRs)
└── tests/                           # 26 Unit and Integration Tests (Vitest)
```

---

## 🤖 Optional Local AI Setup (Ollama)

RepoPilot operates 100% without AI. If you want evidence-grounded AI explanations:
1. Install Ollama from [ollama.com](https://ollama.com).
2. Pull a lightweight coding model:
   ```bash
   ollama run qwen2.5-coder:1.5b
   ```
3. Open `http://localhost:3000/settings/ai` and click **"Test Connection"**. RepoPilot will immediately detect your local model!

---

## 🛡️ Honest Limitations & Boundaries

1. **GitHub Unauthenticated Rate Limits**: Public requests are limited to 60 req/hour by GitHub. Users can supply an optional personal token in Settings to increase this to 5,000 req/hour.
2. **Repository File Bounds**: Capped at 1,500 source files per repository to maintain fast browser reactivity within ₹0 constraints.
3. **Execution Policy**: Untrusted code execution is strictly disabled. All suggested bug fixes are presented as candidate unified diffs for human review.

---

## 📜 License
MIT License. Created with ❤️ for students and open-source contributors.
