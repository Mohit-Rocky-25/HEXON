# ADR 001: Zero-Budget Architecture and Local Compute Strategy

## Context
RepoPilot is designed for CSE students, open-source contributors, and software engineers to explore, understand, and debug codebases without incurred API costs. The creator has an operating budget of ₹0.

## Decision
1. **GitHub Ingestion**: Use the public unauthenticated GitHub REST API (`https://api.github.com/repos/{owner}/{repo}`) with smart local caching and optional user-supplied GitHub tokens for higher rate limits (5,000 req/hr vs 60 req/hr).
2. **Search**: Implement deterministic local search via SQLite FTS5 and in-memory indexing. Do not require hosted vector databases or paid embedding APIs.
3. **Optional AI**: Support local inference via Ollama (`http://localhost:11434`), letting users run lightweight open-weights models (e.g., `qwen2.5-coder:1.5b`, `llama3.2:3b`, `codellama`) on their own machines.
4. **Offline Resilience**: The entire application (file explorer, symbol search, architecture analysis, git revision tracking, bug trace analysis) remains 100% operational when no AI is installed or running.

## Consequences
- High accessibility for any developer regardless of budget.
- No risk of sudden API billing surprises.
- Reproducible, verifiable results grounded in actual source files.
