"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { RepositoryReference, RepositoryFile, AIProviderConfiguration } from "@repopilot/core";

export interface ActiveInvestigation {
  id: string;
  repoKey: string;
  commitSha: string;
  title: string;
  description: string;
  stackTrace: string;
  parsedTrace: any;
  hypotheses: any[];
  candidatePatch?: {
    filePath: string;
    diff: string;
    rationale: string;
  };
  suggestedTests: string[];
  reproducibleReport: string;
  createdAt: string;
}

interface RepositoryContextType {
  currentRepo: RepositoryReference | null;
  setCurrentRepo: (repo: RepositoryReference | null) => void;
  files: RepositoryFile[];
  setFiles: (files: RepositoryFile[]) => void;
  recentRepos: RepositoryReference[];
  saveRecentRepo: (repo: RepositoryReference) => void;
  activeInvestigation: ActiveInvestigation | null;
  setActiveInvestigation: (inv: ActiveInvestigation | null) => void;
  isImportModalOpen: boolean;
  setIsImportModalOpen: (open: boolean) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  aiConfig: AIProviderConfiguration;
  setAiConfig: React.Dispatch<React.SetStateAction<AIProviderConfiguration>>;
  rateLimit: { remaining: number; limit: number };
  setRateLimit: React.Dispatch<React.SetStateAction<{ remaining: number; limit: number }>>;
}

const RepositoryContext = createContext<RepositoryContextType | undefined>(undefined);

export const RepositoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRepo, setCurrentRepo] = useState<RepositoryReference | null>(null);
  const [files, setFiles] = useState<RepositoryFile[]>([]);
  const [recentRepos, setRecentRepos] = useState<RepositoryReference[]>([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [rateLimit, setRateLimit] = useState<{ remaining: number; limit: number }>({
    remaining: 60,
    limit: 60
  });
  const [aiConfig, setAiConfig] = useState<AIProviderConfiguration>({
    provider: "ollama",
    baseUrl: "http://localhost:11434",
    modelName: "qwen2.5-coder:1.5b",
    isAvailable: false
  });

  const [activeInvestigation, setActiveInvestigationState] = useState<ActiveInvestigation | null>(null);

  // Load persisted active repo & history on mount
  useEffect(() => {
    try {
      const storedRecent = localStorage.getItem("REPOPILOT_RECENT_REPOS");
      if (storedRecent) {
        const parsed = JSON.parse(storedRecent);
        setRecentRepos(parsed);
        if (!currentRepo && parsed.length > 0) {
          setCurrentRepo(parsed[0]);
        }
      }

      const storedInvestigation = localStorage.getItem("REPOPILOT_ACTIVE_INVESTIGATION");
      if (storedInvestigation) {
        setActiveInvestigationState(JSON.parse(storedInvestigation));
      }

      const storedAi = localStorage.getItem("REPOPILOT_AI_CONFIG");
      if (storedAi) {
        setAiConfig(JSON.parse(storedAi));
      }
    } catch (e) {
      console.warn("Could not load from localStorage:", e);
    }
  }, []);

  const setActiveInvestigation = (inv: ActiveInvestigation | null) => {
    setActiveInvestigationState(inv);
    try {
      if (inv) {
        localStorage.setItem("REPOPILOT_ACTIVE_INVESTIGATION", JSON.stringify(inv));
      } else {
        localStorage.removeItem("REPOPILOT_ACTIVE_INVESTIGATION");
      }
    } catch (e) {}
  };

  const saveRecentRepo = (repo: RepositoryReference) => {
    // Clear files and active investigation if switching to a different repo
    if (!currentRepo || currentRepo.fullName !== repo.fullName) {
      setFiles([]);
      setActiveInvestigation(null);
    }
    setCurrentRepo(repo);
    setRecentRepos((prev) => {
      const filtered = prev.filter((r) => r.fullName !== repo.fullName);
      const updated = [repo, ...filtered].slice(0, 8);
      try {
        localStorage.setItem("REPOPILOT_RECENT_REPOS", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Keyboard shortcut for quick search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <RepositoryContext.Provider
      value={{
        currentRepo,
        setCurrentRepo,
        files,
        setFiles,
        recentRepos,
        saveRecentRepo,
        activeInvestigation,
        setActiveInvestigation,
        isImportModalOpen,
        setIsImportModalOpen,
        isSearchModalOpen,
        setIsSearchModalOpen,
        aiConfig,
        setAiConfig,
        rateLimit,
        setRateLimit
      }}
    >
      {children}
    </RepositoryContext.Provider>
  );
};

export const useRepository = () => {
  const context = useContext(RepositoryContext);
  if (!context) {
    throw new Error("useRepository must be used within a RepositoryProvider");
  }
  return context;
};
