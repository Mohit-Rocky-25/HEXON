"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { ImportModal } from "@/components/modals/ImportModal";
import { SearchModal } from "@/components/modals/SearchModal";
import { useRepository } from "@/context/RepositoryContext";

export const ShellLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    currentRepo,
    setIsImportModalOpen,
    setIsSearchModalOpen,
    rateLimit,
    aiConfig
  } = useRepository();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-console-bg text-console-text font-sans">
      {/* Pinned Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          currentRepo={currentRepo}
          onOpenImport={() => setIsImportModalOpen(true)}
          onOpenSearch={() => setIsSearchModalOpen(true)}
          rateLimit={rateLimit}
          aiStatus={aiConfig.isAvailable ? "ready" : "offline"}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto bg-console-bg p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Modals */}
      <ImportModal />
      <SearchModal />
    </div>
  );
};
