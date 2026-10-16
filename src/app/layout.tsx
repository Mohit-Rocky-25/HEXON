import "@/styles/globals.css";
import React from "react";
import type { Metadata } from "next";
import { RepositoryProvider } from "@/context/RepositoryContext";
import { ShellLayout } from "@/components/layout/ShellLayout";

export const metadata: Metadata = {
  title: "RepoPilot | Open-Source Repository Intelligence Console",
  description:
    "Zero-budget open-source developer platform for understanding unfamiliar codebases, architectural analysis, symbol navigation, and evidence-backed bug investigation."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-console-bg text-console-text antialiased min-h-screen">
        <RepositoryProvider>
          <ShellLayout>{children}</ShellLayout>
        </RepositoryProvider>
      </body>
    </html>
  );
}
