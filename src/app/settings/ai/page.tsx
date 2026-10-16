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
  Save,
  Copy,
  Check,
  ExternalLink,
  Laptop
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
  const [copiedCmd, setCopiedCmd] = useState(false);
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
        error: "Could not establish connection to local Ollama daemon."
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

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Title */}
      <div className="pb-3 border-b border-stone-200">
        <h1 className="text-lg font-semibold text-stone-900 font-mono flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#F55036]" />
          <span>Local AI (Ollama) Diagnostics & Configuration</span>
        </h1>
        <p className="text-xs text-stone-600 mt-0.5">
          Configure zero-cost, private, local open-weights inference without hosted cloud API fees.
        </p>
      </div>

      {/* Connection Status Card */}
      <Card className="p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            {statusResult?.isAvailable ? (
              <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-full bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-stone-900 font-mono">
                  {statusResult?.isAvailable ? "Ollama Connected & Operational" : "Ollama Daemon Offline / Unreachable"}
                </h2>
                <Badge variant={statusResult?.isAvailable ? "success" : "neutral"} size="sm">
                  {statusResult?.isAvailable ? "ONLINE" : "OFFLINE"}
                </Badge>
              </div>
              <p className="text-xs text-stone-600 mt-0.5 font-mono">
                Active Endpoint: <code className="text-stone-900 bg-stone-100 px-1 py-0.5 rounded">{baseUrl}</code>
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

        {statusResult && !statusResult.isAvailable && (
          <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200 text-xs font-mono space-y-2">
            <div className="flex items-center gap-2 text-stone-800 font-semibold">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Offline Diagnostic & Graceful Fallback Active</span>
            </div>
            <p className="text-stone-600 leading-relaxed">
              No local Ollama server answered on <code className="text-stone-900 font-semibold">{baseUrl}</code>.
              RepoPilot will automatically operate in <strong>100% offline deterministic mode</strong> — code search, AST symbol indexing, and architecture mapping remain fully functional.
            </p>
          </div>
        )}

        {statusResult?.models && statusResult.models.length > 0 && (
          <div className="pt-2 border-t border-stone-200 space-y-1.5">
            <span className="text-[11px] font-mono text-stone-500 uppercase font-semibold">
              Installed Models on Local Machine ({statusResult.models.length}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {statusResult.models.map((m) => (
                <button
                  key={m}
                  onClick={() => setModelName(m)}
                  className={`px-2.5 py-1 rounded font-mono text-xs border transition-colors ${
                    modelName === m
                      ? "bg-[#0C0A09] text-white border-[#0C0A09] font-medium"
                      : "bg-[#FAFAF9] text-stone-700 hover:bg-stone-100 border-stone-200"
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
        <h2 className="text-sm font-semibold text-stone-900 font-mono uppercase">
          Endpoint & Model Configuration
        </h2>

        <div className="space-y-3 font-mono text-xs">
          <div>
            <label className="block text-stone-700 mb-1.5 font-medium">
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
            <label className="block text-stone-700 mb-1.5 font-medium">
              Target Model Identifier
            </label>
            <Input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="qwen2.5-coder:1.5b"
            />
            <span className="text-[11px] text-stone-500 block mt-1">
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

      {/* Quick Setup Instructions */}
      <Card className="p-5 space-y-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#F55036]" />
          <h2 className="text-sm font-semibold text-stone-900 uppercase">
            Windows / macOS / Linux Local Setup Guide
          </h2>
        </div>

        <ol className="list-decimal list-inside space-y-2.5 text-stone-600 leading-relaxed pl-1">
          <li>
            Download and install Ollama from{" "}
            <a
              href="https://ollama.com"
              target="_blank"
              rel="noreferrer"
              className="text-[#F55036] underline inline-flex items-center gap-0.5"
            >
              <span>https://ollama.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </li>
          <li>
            Open PowerShell (or Terminal) and pull a lightweight open-weights coding model:
            <div className="mt-1.5 flex items-center justify-between p-2.5 bg-[#FAFAF9] border border-stone-200 rounded text-stone-900">
              <code>ollama run qwen2.5-coder:1.5b</code>
              <Button
                variant="ghost"
                size="sm"
                icon={copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                onClick={() => copyCommand("ollama run qwen2.5-coder:1.5b")}
              >
                {copiedCmd ? "Copied" : "Copy"}
              </Button>
            </div>
          </li>
          <li>
            Once running, click <strong>"Test Connection"</strong> above. RepoPilot will immediately recognize your local model!
          </li>
        </ol>
      </Card>
    </div>
  );
}
