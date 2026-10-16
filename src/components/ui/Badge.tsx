import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "neutral" | "cyan" | "success" | "warning" | "danger" | "violet";
  size?: "sm" | "md";
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  size = "sm",
  className = "",
  icon
}) => {
  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 font-mono",
    md: "text-xs px-2.5 py-1 font-mono"
  };

  const variantStyles = {
    neutral: "bg-stone-100 text-stone-700 border border-stone-200",
    cyan: "bg-orange-50 text-[#F55036] border border-orange-200",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    danger: "bg-red-50 text-red-700 border border-red-200",
    violet: "bg-indigo-50 text-indigo-700 border border-indigo-200"
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
