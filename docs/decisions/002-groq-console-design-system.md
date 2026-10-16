# ADR 002: GroqCloud Developer Console Visual Design System

## Context
Developer tools often fall into two visual traps: either generic, bloated AI dashboard templates with excessive neon gradients and cartoonish animations, or unstyled bare-bones prototypes. RepoPilot targets the aesthetic, precision, and technical density of the GroqCloud Developer Console (https://console.groq.com/).

## Decision
1. **Visual Style**:
   - High information density, monochromatic dark theme with deep obsidian backgrounds (`#07090e`, `#0d1117`).
   - Crisp 1px borders (`#30363d`), subtle elevation, and no gratuitous glow effects or floating decorative bubbles.
   - Clean tabular and split-pane views reminiscent of Groq's model selector and playground.
2. **Typography**:
   - UI: Modern sans-serif (Inter / Plus Jakarta Sans) for clean readability.
   - Code & Metrics: Monospace (JetBrains Mono / SFMono) for code, commit SHAs, line numbers, and API response headers.
3. **No Fluff & Real Interactivity**:
   - No mock buttons that do nothing.
   - Real repository exploration, real file contents, accurate line numbers.

## Consequences
- Clean, focused developer experience.
- Fast rendering performance with zero heavy animation overhead.
- Professional credibility as an open-source engineering portfolio project.
