export interface ExecutionPolicyConfig {
  executionEnabled: boolean;
  timeoutMs: number;
  allowNetwork: boolean;
  maxMemoryMb: number;
}

export const DEFAULT_EXECUTION_POLICY: ExecutionPolicyConfig = {
  executionEnabled: false, // Disabled by default for security
  timeoutMs: 15000,
  allowNetwork: false,
  maxMemoryMb: 512
};

export interface ReproductionPlan {
  environment: "Node.js" | "Python" | "Go" | "Rust" | "Generic";
  commands: string[];
  safetyNotes: string[];
}

export class ExecutionPolicy {
  /**
   * Generates safe, verified manual reproduction steps tailored to the repository's stack.
   */
  static generateReproductionPlan(
    repoKey: string,
    commitSha: string,
    primaryLanguage?: string,
    suggestedTests: string[] = []
  ): ReproductionPlan {
    const lang = primaryLanguage?.toLowerCase() || "";

    if (lang.includes("typescript") || lang.includes("javascript")) {
      return {
        environment: "Node.js",
        commands: [
          `git clone https://github.com/${repoKey}.git`,
          `cd ${repoKey.split("/")[1] || "repo"}`,
          `git checkout ${commitSha.slice(0, 7)}`,
          `npm install`,
          `npm test`
        ],
        safetyNotes: [
          "Execute commands inside an isolated container or development environment.",
          "Inspect package.json dependencies and scripts before executing."
        ]
      };
    }

    if (lang.includes("python")) {
      return {
        environment: "Python",
        commands: [
          `git clone https://github.com/${repoKey}.git`,
          `cd ${repoKey.split("/")[1] || "repo"}`,
          `git checkout ${commitSha.slice(0, 7)}`,
          `python -m venv .venv && source .venv/bin/activate`,
          `pip install -r requirements.txt`,
          `pytest`
        ],
        safetyNotes: [
          "Use a dedicated virtual environment (.venv) to prevent pollution of system packages."
        ]
      };
    }

    if (lang.includes("go")) {
      return {
        environment: "Go",
        commands: [
          `git clone https://github.com/${repoKey}.git`,
          `cd ${repoKey.split("/")[1] || "repo"}`,
          `git checkout ${commitSha.slice(0, 7)}`,
          `go test ./...`
        ],
        safetyNotes: [
          "Run tests with network disabled where possible."
        ]
      };
    }

    return {
      environment: "Generic",
      commands: [
        `git clone https://github.com/${repoKey}.git`,
        `cd ${repoKey.split("/")[1] || "repo"}`,
        `git checkout ${commitSha.slice(0, 7)}`
      ],
      safetyNotes: [
        "Review repository README.md for project-specific test instructions."
      ]
    };
  }
}
