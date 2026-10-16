# RepoPilot 🪐

> **Open-Source Repository Intelligence, Code Understanding, and Debugging Platform**  
> *Zero-Budget · 100% Local Compute & Public GitHub · Groq.com Light Editorial Aesthetic*

[![CI](https://github.com/Mohit-Rocky-25/RepoPilot/actions/workflows/ci.yml/badge.svg)](https://github.com/Mohit-Rocky-25/RepoPilot/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Budget: ₹0](https://img.shields.io/badge/API_Budget-₹0-success.svg)](#-zero-budget-operating-model)
[![AI: Local Ollama (Optional)](https://img.shields.io/badge/AI-Ollama_(Optional)-orange.svg)](https://ollama.com)

---

## 🌟 Mission & Audience

**RepoPilot** is an open-source repository intelligence and debugging platform engineered for **CSE students**, **first-time open-source contributors**, and **software engineers** investigating unfamiliar codebases.

When approaching a massive unfamiliar repository, developers often face fragmented documentation, unknown entry points, and confusing runtime errors. RepoPilot provides an evidence-backed platform to progressively:

1. **Explore structure & code**: Browse directory trees and inspect files with exact line numbers and commit-pinned references.
2. **Search deterministically**: Instant file, symbol, and keyword search with ranking without requiring AI.
3. **Analyze architecture**: Identify entry points, frameworks, module roles, and package manifests automatically.
4. **Interactive Q&A & Code Intelligence**: Ask questions grounded directly in indexed code files with exact citations (using optional local Ollama models; no paid APIs required).
5. **Investigate bugs & stack traces**: Correlate error logs and stack traces with repository source lines, formulating evidence-backed hypotheses and testable patch proposals.
6. **Export PR drafts & reports**: Generate reproducible bug reports and pull request descriptions ready for review.

---

## 🎨 Visual Reference: Groq.com Light Editorial Design

RepoPilot adopts the bright, confident visual language inspired by the **Groq.com** marketing website:
- **Warm Light Backgrounds**: Predominantly light base (`#F3F3EE`, `#FFFFFF`, `#F8F8F6`) with crisp neutral borders (`#E7E5E4`).
- **High-Contrast Editorial Typography**: Bold, authoritative headline typography in deep charcoal (`#0C0A09`), paired with JetBrains Mono for commit SHAs, line numbers, and symbol signatures.
- **Controlled Coral Accent**: Groq coral (`#F55036`) for meaningful focal points, active states, and call-to-action treatments.
- **Zero-Demo-Data Policy**: Absolutely no fabricated demo repositories, fake stars, or synthetic metrics in production views. Intentional, clean empty states guide the user to import real repositories.

---

## ⚡ Zero-Budget Operating Model

RepoPilot has a strict **₹0 operating budget**. No paid APIs, no hosted LLM subscriptions, and no paid database clusters:

| Capability | Engineering Strategy | Operating Spend |
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
git clone https://github.com/Mohit-Rocky-25/RepoPilot.git
cd RepoPilot
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 3. Run Quality Verification
```bash
npm run typecheck    # Strict TypeScript verification
npm test             # Run 26 unit & integration tests
npm run build        # Build production Next.js bundle
```

---

## 📁 Architecture & Monolith Structure

```
RepoPilot/
├── src/
│   ├── app/                         # Next.js App Router (Layouts & Pages)
│   │   ├── page.tsx                 # 11-Section Groq.com Editorial Landing Page
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
│   └── styles/                      # globals.css (Groq light-theme design tokens)
├── packages/                        # Domain Engines
│   ├── core/                        # Strict Zod Schemas & Domain Types
│   ├── github/                      # Rate-limit-aware GitHub Client & Validator
│   ├── indexer/                     # Deterministic Symbol Extractor (TS, JS, Py, Go, Rust)
│   ├── search/                      # Multi-Modal Ranked Search Engine
│   ├── analysis/                    # Framework & Entry Point Detector
│   ├── ai/                          # Ollama Local Client & Citation Validator
│   ├── debugging/                   # Stack Trace Parser & Hypothesis Formulator
│   └── execution/                   # Sandbox Safety Policy & Manual Reproduction Engine
└── tests/                           # Vitest Unit & Integration Suites
```

---

## 🛡️ Security & Privacy Boundary

1. **Untrusted Code Sandbox**: RepoPilot treats all third-party repositories as untrusted. No repository build scripts, package installation hooks (`postinstall`), or test suites are ever executed automatically.
2. **SSRF Protection**: Repository imports are strictly validated against approved hosts (`github.com`) and blocked from localhost/private IP ranges.
3. **Local-Only Credentials**: Optional GitHub Personal Access Tokens are stored purely in your browser's LocalStorage and never leave your machine.

---

## 🤝 Contributing

We welcome contributions from developers, students, and open-source advocates!

1. Fork the repository on GitHub: [https://github.com/Mohit-Rocky-25/RepoPilot](https://github.com/Mohit-Rocky-25/RepoPilot)
2. Create your feature branch (`git checkout -b feat/new-language-parser`)
3. Ensure all tests and typechecks pass (`npm run typecheck && npm test`)
4. Commit your changes (`git commit -m 'feat: add parser for Kotlin'`)
5. Push to your branch (`git push origin feat/new-language-parser`)
6. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for more details.
