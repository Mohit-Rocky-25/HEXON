# Security Policy

## Reporting Security Issues
If you discover a security vulnerability within RepoPilot, please **do not** open a public issue. Send an email to the maintainer or report via private security advisories.

## Security Principles & Boundaries
1. **SSRF Prevention**: All incoming repository URLs are strictly validated using regex against `https://github.com/([a-zA-Z0-9_.-]+)/([a-zA-Z0-9_.-]+)`. Requests to local IP addresses, private subnets, loopbacks, or non-GitHub hosts are rejected before any network traffic is initiated.
2. **Path Traversal Protection**: Relative file paths within repository trees are strictly validated against null bytes, directory navigation (`..`), and absolute paths.
3. **Zero Automated Code Execution**: In strict adherence to our safety policy, RepoPilot **never** executes untrusted repository build scripts, test suites, or package install hooks automatically.
4. **Secret Protection**: Personal GitHub tokens configured in Settings are persisted exclusively in client-side LocalStorage and are only used for direct requests to `api.github.com`.
5. **No Hidden Costs**: No paid third-party API dependencies or external hosted AI inference calls exist in the core application.
