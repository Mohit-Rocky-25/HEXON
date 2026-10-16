# RepoPilot — System Architecture & Implementation Plan

## 1. Executive Summary & Mission
**RepoPilot** is an open-source, zero-budget repository intelligence, code understanding, and debugging platform.
Designed for students, open-source contributors, and software engineers investigating unfamiliar codebases, RepoPilot enables users to import any public GitHub repository and progressively:
1. **Explore structure & code**: Browse tree hierarchies, view syntax-highlighted files with exact line numbers and commit-pinned references.
2. **Search deterministically**: Instant file, symbol, and regex/text search with ranking without requiring AI.
3. **Analyze architecture**: Identify entry points, frameworks, module trees, import graphs, and configuration files deterministically.
4. **Interactive Q&A & Code Intelligence**: Ask questions grounded directly in indexed code files with exact citations (using optional local Ollama models; no paid APIs required).
5. **Investigate bugs & stack traces**: Correlate error logs and stack traces with repository source lines, formulating evidence-backed hypotheses and testable patch proposals.
6. **Contribution assistance**: Generate pull request descriptions, reproduce steps, and contribution checklists aligned with project guidelines (`CONTRIBUTING.md`).

---

## 2. Hard Constraints & Zero-Budget Operating Model

| Constraint | Policy |
| :--- | :--- |
| **Budget** | **₹0**. Zero mandatory paid APIs, zero hosted LLM dependencies. |
| **Repository Ingestion** | Public GitHub REST API (with rate-limit awareness and optional user-provided GitHub Token). |
| **Search Engine** | SQLite FTS5 + deterministic symbol indexers + in-memory fast matching. |
| **Optional AI Inference** | Local Ollama endpoint (`http://localhost:11434` or custom URL). System is 100% functional without AI. |
| **Workspace Isolation** | Strict sandboxing inside current directory. Zero access to unrelated projects. |
| **Security Boundary** | Untrusted code is never executed by default. Code execution is sandboxed or replaced with reproducible manual commands and patch diffs. |

---

## 3. Visual Design System: GroqCloud Console Reference

Inspired by the **GroqCloud Developer Console** (https://console.groq.com/):
- **Palette**: Monochromatic obsidian dark mode (`#07090e`, `#0d1117`, `#161b22`) with high-contrast neutral borders (`#30363d`), crisp white headers (`#f0f6fc`), muted secondary text (`#8b949e`), and precision status accents (Terminal Cyan `#00f2fe`, Emerald `#3fb950`, Amber `#d29922`, Coral `#f85149`, Electric Violet `#a371f7`).
- **Typography**: Inter / Plus Jakarta Sans for UI, JetBrains Mono / SFMono-Regular for code and metrics. High technical information density.
- **Controls**: Restrained rectangular buttons with subtle borders, tabbed toolbars, monospace status badges, split panes with resizable dividers, pinned sidebars, and keyboard shortcut indicators (`Ctrl+K` / `⌘K`).
- **No Fluff**: No cartoonish animations, no bloated gradient cards, no fake telemetry. Real data, real commits, real line numbers.

---

## 4. Modular Monolith Architecture

```
RepoPilot/
├── apps/
│   └── web/
│       ├── app/                     # Next.js App Router (Layouts, Pages, Route Handlers)
│       │   ├── layout.tsx           # Global console shell & navigation
│       │   ├── page.tsx             # Home / Import / Quick Launch
│       │   ├── overview/            # Repository metadata & health overview
│       │   ├── repositories/        # Repository switcher & management
│       │   ├── explore/             # File tree & high-performance code viewer
│       │   ├── search/              # Full-text & symbol search console
│       │   ├── architecture/        # Module dependencies, entry points, tech stack
│       │   ├── assistant/           # Grounded Q&A workspace
│       │   ├── debugging/           # Bug investigation, stack trace analyzer
│       │   ├── patches/             # Proposed patches & diff viewer
│       │   ├── history/             # Indexed repositories & analysis history
│       │   ├── settings/            # Local AI / Ollama configuration & diagnostics
│       │   └── api/                 # Next.js Route Handlers
│       ├── components/              # UI components (Groq-inspired design system)
│       ├── hooks/                   # Custom React hooks (keyboard shortcuts, data fetching)
│       ├── public/                  # Assets, brand emblems, and static icons
│       └── tests/                   # End-to-end and component tests
├── packages/
│   ├── core/                        # Domain models, validated Zod schemas, errors
│   ├── github/                      # GitHub API client, tree fetcher, rate-limit manager
│   ├── indexer/                     # Deterministic symbol extractor, language classifier
│   ├── search/                      # SQLite FTS5 engine, BM25 ranking, text matcher
│   ├── analysis/                    # Architecture detection, entry point finder, import parser
│   ├── ai/                          # Ollama client, prompt engineering, citation verifier
│   ├── debugging/                   # Stack trace parser, bug hypothesis engine, patch builder
│   └── storage/                     # SQLite persistence, schema migrations, local cache
├── docs/                            # Architecture specifications, security model, user guides
└── tests/                           # Vitest unit & integration test suites
```

---

## 5. Domain Models & Contracts (Zod-Validated)

- **`RepositoryReference`**: `owner`, `repo`, `url`, `defaultBranch`, `selectedRevision`
- **`RepositoryRevision`**: `commitSha`, `treeSha`, `author`, `date`, `message`
- **`RepositoryFile`**: `path`, `size`, `type` (`blob` | `tree`), `language`, `extension`, `sha`
- **`IndexedSymbol`**: `name`, `kind` (`function` | `class` | `interface` | `variable` | `type` | `import`), `filePath`, `startLine`, `endLine`, `signature`
- **`SourceReference`**: `repoKey`, `commitSha`, `filePath`, `startLine`, `endLine`, `codeSnippet`, `url`
- **`SearchQuery` & `SearchResult`**: query string, file filter, language filter, matched lines, score, context snippet
- **`ArchitectureSummary`**: detected frameworks, entry points, configuration manifests, module graph
- **`BugHypothesis` & `PatchProposal`**: issue description, error stack trace, ranked culprit files, unified diff proposal, verification status

---

## 6. Security Boundaries & Risk Mitigation

1. **SSRF Prevention**: Validate all GitHub repository URLs strictly against `https://github.com/([a-zA-Z0-9_.-]+)/([a-zA-Z0-9_.-]+)`. Reject internal IP addresses, local network URLs, or private loopbacks.
2. **Path Traversal Protection**: Ensure all relative file paths inside repositories resolve safely within the repository virtual root. Reject `..`, null bytes, and absolute Windows/Unix paths.
3. **Execution Policy**: Repository source code is treated as strictly untrusted. **No automated arbitrary code execution**. Tests and execution checks are generated as safe reproducible scripts or sandboxed instructions.
4. **Secret Protection**: Automatically detect and mask accidental API tokens, private keys, or passwords when indexing files.

---

## 7. Stage-by-Stage Verification Strategy

| Stage | Name | Key Deliverables | Verification Check |
| :--- | :--- | :--- | :--- |
| **Stage 0** | Inspection & Architecture | Architecture spec, tool verification, baseline preservation | Git checkpoint clean, spec written |
| **Stage 1** | Foundation & Design System | Next.js App Router, Tailwind, GroqConsole design tokens, shell layout | `npm run build`, `vitest` pass |
| **Stage 2** | Public Repository Ingestion | GitHub API client, tree fetcher, rate-limit cache, revision pinning | Unit tests with mock & public repo tree |
| **Stage 3** | Code Exploration & Search | File tree navigator, code viewer with line numbers, FTS5 & symbol search | Test file navigation & query matches |
| **Stage 4** | Architecture Intelligence | Framework detection, entry point discovery, dependency graph | Test against standard JS/TS/Python fixtures |
| **Stage 5** | Optional Local AI (Ollama) | Local AI adapter, prompt grounding, citation validator, fallback UI | Test with Ollama mock / offline mode |
| **Stage 6** | Bug Investigation & Patches | Stack trace parser, culprit discovery, diff generator | Test trace parsing & unified diff output |
| **Stage 7** | Execution & Validation | Safe execution policy, manual verification guides, test generators | Security audit tests pass |
| **Stage 8** | Product Quality & Release | Visual refinement, full test suite, documentation, LICENSE, CI workflow | All tests green, production build verified |
