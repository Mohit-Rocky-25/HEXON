"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bot,
  Send,
  Sparkles,
  FileCode,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Terminal,
  ExternalLink,
  ShieldCheck,
  Code,
  HelpCircle
} from "lucide-react";
import { useRepository } from "@/context/RepositoryContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import type { SourceReference } from "@repopilot/core";

interface QAItem {
  id: string;
  question: string;
  answer: string;
  citations: SourceReference[];
  modelUsed?: string;
  confidence?: string;
  timestamp: string;
}

export default function AssistantPage() {
  const { currentRepo, aiConfig, setIsImportModalOpen } = useRepository();

  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState<QAItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sampleQuestions = [
    "Where is the main application entry point and how does initialization work?",
    "How is routing and URL dispatching structured in this project?",
    "What state management or persistence mechanism is used?",
    "Where are network API requests configured and handled?"
  ];

  const handleAsk = async (qText: string) => {
    if (!currentRepo || !qText.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner: currentRepo.owner,
          repo: currentRepo.repo,
          sha: currentRepo.selectedRevision,
          question: qText.trim(),
          baseUrl: aiConfig.baseUrl,
          model: aiConfig.modelName
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get an answer.");

      const newItem: QAItem = {
        id: "qa-" + Date.now(),
        question: qText.trim(),
        answer: data.answer,
        citations: data.citations || [],
        modelUsed: data.modelUsed,
        confidence: data.confidence,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setHistory((prev) => [newItem, ...prev]);
      setQuestion("");
    } catch (err: any) {
      setError(err.message || "Failed to process question.");
    } finally {
      setLoading(false);
    }
  };

  if (!currentRepo) {
    return (
      <Card className="p-8 text-center max-w-xl mx-auto my-12 space-y-4">
        <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-[#F55036] mx-auto">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-stone-900">
            No Active Repository
          </h2>
          <p className="text-xs text-stone-600 mt-1 leading-relaxed">
            Import a public GitHub repository to ask questions grounded directly in indexed code files with exact citations.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => setIsImportModalOpen(true)}
          className="mx-auto"
        >
          Import Repository
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-200 gap-2">
        <div>
          <h1 className="text-lg font-semibold text-stone-900 font-mono flex items-center gap-2">
            <Bot className="w-5 h-5 text-[#F55036]" />
            <span>Grounded Code Assistant</span>
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Evidence-grounded code intelligence for {currentRepo.owner}/{currentRepo.repo}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={aiConfig.isAvailable ? "success" : "neutral"} size="sm">
            {aiConfig.isAvailable ? `Ollama (${aiConfig.modelName})` : "Deterministic Fallback (Offline)"}
          </Badge>
          <Link href="/settings/ai">
            <Button variant="secondary" size="sm">
              Configure Local AI
            </Button>
          </Link>
        </div>
      </div>

      {/* Ollama Offline Guidance Banner */}
      {!aiConfig.isAvailable && (
        <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 flex items-start gap-3">
          <Terminal className="w-4 h-4 text-[#F55036] shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs font-mono">
            <div className="text-stone-900 font-semibold">
              Zero-Budget Offline Mode Active
            </div>
            <p className="text-stone-600 leading-relaxed">
              When local Ollama is offline, RepoPilot uses deterministic AST and keyword search to retrieve exact matching source lines. To enable local generative synthesis, start Ollama with:
            </p>
            <div className="inline-block px-2.5 py-1 rounded bg-white border border-stone-200 text-[#F55036] text-[11px] font-semibold">
              ollama run {aiConfig.modelName}
            </div>
          </div>
        </div>
      )}

      {/* Question Form */}
      <Card className="p-4 space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk(question);
          }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Ask a question about the repository's architecture, state, or functions..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={loading}
            icon={<Send className="w-4 h-4" />}
            className="shrink-0"
          >
            Ask Codebase
          </Button>
        </form>

        {error && (
          <p className="text-xs text-red-600 font-mono pt-1">{error}</p>
        )}

        {/* Quick Suggestion Chips */}
        <div className="pt-2 border-t border-stone-200">
          <span className="text-[11px] font-mono text-stone-500 uppercase tracking-wider block mb-1.5 font-semibold">
            Suggested Queries:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {sampleQuestions.map((sq) => (
              <button
                key={sq}
                onClick={() => {
                  setQuestion(sq);
                  handleAsk(sq);
                }}
                disabled={loading}
                className="px-2.5 py-1 rounded bg-[#FAFAF9] hover:bg-stone-100 border border-stone-200 text-[11px] font-mono text-stone-700 hover:text-stone-900 transition-colors text-left"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Q&A Stream */}
      <div className="space-y-4">
        {history.map((item) => (
          <Card key={item.id} className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
              <span className="text-sm font-semibold text-stone-900 font-mono">
                Q: {item.question}
              </span>
              <div className="flex items-center gap-2">
                {item.modelUsed && (
                  <Badge variant="primary" size="sm">
                    {item.modelUsed}
                  </Badge>
                )}
                <span className="text-[11px] font-mono text-stone-500">
                  {item.timestamp}
                </span>
              </div>
            </div>

            {/* Answer Text */}
            <div className="text-xs text-stone-800 font-mono whitespace-pre-wrap leading-relaxed">
              {item.answer}
            </div>

            {/* Citations Box */}
            {item.citations.length > 0 && (
              <div className="pt-3 border-t border-stone-200 space-y-2">
                <span className="text-[11px] font-mono text-stone-500 uppercase tracking-wider block font-semibold">
                  Grounding Source References:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {item.citations.map((cit, idx) => (
                    <Link
                      key={idx}
                      href={`/explore?file=${encodeURIComponent(cit.filePath)}&line=${cit.startLine}`}
                      className="p-2.5 rounded bg-[#FAFAF9] hover:bg-stone-100 border border-stone-200 transition-colors group font-mono text-xs block"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 truncate">
                          <FileCode className="w-3.5 h-3.5 text-[#F55036] shrink-0" />
                          <span className="text-stone-900 font-medium truncate group-hover:text-[#F55036]">
                            {cit.filePath}
                          </span>
                        </div>
                        <span className="text-[11px] text-stone-500 shrink-0">
                          L{cit.startLine}-{cit.endLine}
                        </span>
                      </div>
                      {cit.codeSnippet && (
                        <div className="mt-1.5 text-[10px] text-stone-600 truncate bg-white p-1 rounded border border-stone-100">
                          {cit.codeSnippet.split("\n")[0]}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
