import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "secondary",
  size = "md",
  isLoading = false,
  icon,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-console-accent disabled:opacity-50 disabled:cursor-not-allowed select-none rounded";

  const sizeStyles = {
    sm: "text-xs px-2.5 py-1.5 gap-1.5",
    md: "text-sm px-3.5 py-2 gap-2",
    lg: "text-base px-4 py-2.5 gap-2.5"
  };

  const variantStyles = {
    primary:
      "bg-console-accent text-[#07090e] font-semibold hover:bg-console-accentHover shadow-sm active:scale-[0.98]",
    secondary:
      "bg-console-subtle hover:bg-console-elevated text-console-text border border-console-border hover:border-console-borderHover",
    outline:
      "bg-transparent text-console-text border border-console-border hover:bg-console-subtle hover:border-console-borderHover",
    ghost:
      "bg-transparent text-console-muted hover:text-console-text hover:bg-console-subtle",
    danger:
      "bg-console-danger/10 text-console-danger border border-console-danger/30 hover:bg-console-danger/20"
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children}
    </button>
  );
};
