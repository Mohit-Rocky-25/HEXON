# Contributing to RepoPilot

Thank you for your interest in contributing to **RepoPilot**!
RepoPilot is an open-source, zero-budget repository intelligence and debugging platform built for students and open-source contributors.

---

## 🌟 Code of Conduct
We are committed to providing a welcoming, inclusive, and harassment-free environment. Please review our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## 🚀 Development Setup

1. **Prerequisites**:
   - Node.js 18.x or 20+
   - npm 9+
   - Git
   - (Optional) [Ollama](https://ollama.com) for local AI coding models

2. **Clone and Install**:
   ```bash
   git clone https://github.com/your-username/RepoPilot.git
   cd RepoPilot
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Run Tests & Verification**:
   ```bash
   npm run typecheck    # Strict TypeScript check
   npm test             # Run Vitest test suite
   npm run build        # Verify production Next.js build
   ```

---

## 🛡️ Engineering & Security Standards

- **Zero-Budget Principle**: Do not introduce mandatory paid APIs or commercial cloud databases. Core features must work with public GitHub endpoints and local compute.
- **Evidence-Grounding**: Any AI features must cite verifiable file paths and line numbers.
- **Test Coverage**: Write unit tests for new domain schemas, parsers, or search algorithms in `tests/`.
- **Safe Sandboxing**: Never implement automatic execution of untrusted repository code.

---

## 📬 Pull Request Process

1. Fork the repository and create your branch from `main`.
2. Ensure `npm run typecheck` and `npm test` pass with 0 errors.
3. Open a pull request describing the rationale and testing evidence.
