"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderTree,
  Search,
  Cpu,
  Bug,
  GitPullRequest,
  Settings,
  Bot,
  Layers,
  BookOpen,
  Terminal,
  Activity,
  Compass
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const sections: { title: string; items: NavItem[] }[] = [
    {
      title: "Repository",
      items: [
        {
          name: "Overview",
          href: "/",
          icon: <Layers className="w-4 h-4" />
        },
        {
          name: "Code Explorer",
          href: "/explore",
          icon: <FolderTree className="w-4 h-4" />
        },
        {
          name: "Search & Symbols",
          href: "/search",
          icon: <Search className="w-4 h-4" />
        },
        {
          name: "Architecture & 3D Map",
          href: "/architecture",
          icon: <Cpu className="w-4 h-4" />
        }
      ]
    },
    {
      title: "Intelligence",
      items: [
        {
          name: "Code Assistant",
          href: "/assistant",
          icon: <Bot className="w-4 h-4" />,
          badge: "Ollama"
        },
        {
          name: "Bug Investigation",
          href: "/debugging",
          icon: <Bug className="w-4 h-4" />
        },
        {
          name: "Patch Review",
          href: "/patches",
          icon: <GitPullRequest className="w-4 h-4" />
        }
      ]
    },
    {
      title: "System",
      items: [
        {
          name: "Local AI (Ollama)",
          href: "/settings/ai",
          icon: <Activity className="w-4 h-4" />
        },
        {
          name: "Settings",
          href: "/settings",
          icon: <Settings className="w-4 h-4" />
        },
        {
          name: "Docs & Limits",
          href: "/docs",
          icon: <BookOpen className="w-4 h-4" />
        }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-stone-200 flex flex-col shrink-0 select-none shadow-xs">
      {/* Brand Header */}
      <div className="h-14 flex items-center px-4 border-b border-stone-200 gap-2.5">
        <div className="w-7 h-7 rounded-md bg-[#0C0A09] flex items-center justify-center text-white">
          <Compass className="w-4 h-4 text-[#F55036]" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm tracking-tight text-stone-900 font-mono">
              RepoPilot
            </span>
            <span className="text-[10px] uppercase font-mono px-1 py-0.2 rounded bg-stone-100 text-stone-600 border border-stone-200">
              v1.0
            </span>
          </div>
          <span className="text-[10.5px] text-stone-500 font-mono">
            Codebase Intelligence
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {sections.map((sec, secIdx) => (
          <div key={secIdx}>
            <div className="px-2 pb-1.5 text-[10.5px] font-mono tracking-wider text-stone-400 uppercase font-semibold">
              {sec.title}
            </div>
            <div className="space-y-0.5">
              {sec.items.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md transition-colors font-mono ${
                      isActive
                        ? "bg-[#FAFAF9] text-[#F55036] font-semibold border-l-2 border-[#F55036] shadow-xs"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? "text-[#F55036]" : "text-stone-500"}>
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 border border-stone-200">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info / Zero-Budget Indicator */}
      <div className="p-3 border-t border-stone-200 bg-[#FAFAF9] text-[11px] text-stone-500 font-mono flex items-center justify-between">
        <span>Zero-Budget · FOSS</span>
        <span className="text-emerald-700 font-medium">● Local Offline</span>
      </div>
    </aside>
  );
};
