"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  CheckCircle,
  XCircle,
  RefreshCw,
  Cpu,
  ShieldCheck,
  AlertCircle,
  Terminal,
  Save
} from "lucide-react";
import { useRepository } from "@/context/RepositoryContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

export default function AISettingsPage() {
  const { aiConfig, setAiConfig } = useRepository();

  const [baseUrl, setBaseUrl] = useState(aiConfig.baseUrl);
  const [modelName, setModelName] = useState(aiConfig.modelName);
  const [testing, setTesting] = useState(false);
  const [statusResult, setStatusResult] = useState<{
    isAvailable: boolean;
    models: string[];
    error?: string;
  } | null>(null);

  const testConnection = async () => {
    setTesting(true);
    setStatusResult(null);
    try {
      const res = await fetch(`/api/ai/status?baseUrl=${encodeURIComponent(baseUrl)}`);
      const data = await res.json();
      setStatusResult(data);

      setAiConfig((prev) => {
        const updated = {
          ...prev,
          baseUrl,
          modelName,
          isAvailable: data.isAvailable,
          lastPing: new Date().toISOString()
        };
        try {
          localStorage.setItem("REPOPILOT_AI_CONFIG", JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    } catch (e: any) {
      setStatusResult({
        isAvailable: false,
        models: [],
        error: "Failed to connect to local Ollama server."
      });
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  const saveSettings = () => {
    const updated = {
      ...aiConfig,
      baseUrl,
      modelName
    };
    setAiConfig(updated);
    try {
      localStorage.setItem("REPOPILOT_AI_CONFIG", JSON.stringify(updated));
    } catch (e) {}
    testConnection();
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Title */}
      <div className="pb-3 border-b border-console-border">
        <h1 className="text-lg font-semibold text-console-text font-mono flex items-center gap-2">
          <Activity className="w-5 h-5 text-console-accent" />
          <span>Local AI (Ollama) Diagnostics & Configuration</span>
        </h1>
        <p className="text-xs text-console-muted mt-0.5">
          Configure local open-weights inference without paying for hosted LLM APIs.
        </p>
      </div>

      {/* Connection Status Card */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {statusResult?.isAvailable ? (
              <CheckCircle className="w-5 h-5 text-console-success" />
            ) : (
              <XCircle className="w-5 h-5 text-console-danger" />
            )}
            <div>
              <h2 className="text-sm font-semibold text-console-text font-mono">
                {statusResult?.isAvailable ? "Ollama Connected & Ready" : "Ollama Not Reachable"}
              </h2>
              <p className="text-xs text-console-muted">
                Endpoint: <code className="text-console-text">{baseUrl}</code>
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={testConnection}
            isLoading={testing}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Test Connection
          </Button>
        </div>

        {statusResult?.error && (
          <div className="p-3 rounded bg-console-danger/10 border border-console-danger/30 text-console-danger text-xs font-mono">
            {statusResult.error}
          </div>
        )}

        {statusResult?.models && statusResult.models.length > 0 && (
          <div className="pt-2 border-t border-console-border space-y-1.5">
            <span className="text-[11px] font-mono text-console-dim uppercase">
              Installed Models on Local Machine ({statusResult.models.length}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {statusResult.models.map((m) => (
                <button
                  key={m}
                  onClick={() => setModelName(m)}
                  className={`px-2 py-0.5 rounded font-mono text-xs border transition-colors ${
                    modelName === m
                      ? "bg-console-accent text-[#07090e] border-console-accent font-semibold"
                      : "bg-console-subtle text-console-muted hover:text-console-text border-console-border"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Settings Form */}
      <Card className="p-5 space-y-4">
        <h2 className="text-sm font-semibold text-console-text font-mono uppercase">
          Endpoint Settings
        </h2>

        <div className="space-y-3 font-mono text-xs">
          <div>
            <label className="block text-console-muted mb-1.5">
              Ollama Base URL
            </label>
            <Input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="http://localhost:11434"
            />
          </div>

          <div>
            <label className="block text-console-muted mb-1.5">
              Selected Model Name
            </label>
            <Input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="qwen2.5-coder:1.5b"
            />
            <span className="text-[11px] text-console-dim block mt-1">
              Recommended lightweight coding models: <code>qwen2.5-coder:1.5b</code>, <code>llama3.2:3b</code>, <code>deepseek-coder:1.3b</code>
            </span>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              variant="primary"
              size="sm"
              icon={<Save className="w-3.5 h-3.5" />}
              onClick={saveSettings}
            >
              Save Configuration
            </Button>
          </div>
        </div>
      </Card>

      {/* Setup Instructions */}
      <Card className="p-5 space-y-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-console-accent" />
          <h2 className="text-sm font-semibold text-console-text uppercase">
            How to Setup Free Local AI on Windows/Linux/Mac
          </h2>
        </div>

        <ol className="list-decimal list-inside space-y-2 text-console-muted leading-relaxed pl-1">
          <li>
            Download and install Ollama from{" "}
            <a
              href="https://ollama.com"
              target="_blank"
              rel="noreferrer"
              className="text-console-accent underline"
            >
              https://ollama.com
            </a>
          </li>
          <li>
            Open PowerShell or Terminal and pull a lightweight open-weights coding model:
            <pre className="mt-1 p-2 bg-[#07090e] border border-console-border rounded text-console-text">
              ollama run qwen2.5-coder:1.5b
            </pre>
          </li>
          <li>
            Click <strong>"Test Connection"</strong> above. RepoPilot will immediately detect your local model!
          </li>
        </ol>
      </Card>
    </div>
  );
}
