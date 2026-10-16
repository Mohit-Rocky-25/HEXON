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
    neutral: "bg-console-elevated text-console-muted border border-console-border",
    cyan: "bg-console-accent/10 text-console-accent border border-console-accent/30",
    success: "bg-console-success/10 text-console-success border border-console-success/30",
    warning: "bg-console-warning/10 text-console-warning border border-console-warning/30",
    danger: "bg-console-danger/10 text-console-danger border border-console-danger/30",
    violet: "bg-console-violet/10 text-console-violet border border-console-violet/30"
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
