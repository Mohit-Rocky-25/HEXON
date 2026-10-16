import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "elevated";
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  className = "",
  ...props
}) => {
  const variantStyles = {
    default: "bg-console-surface border-console-border",
    subtle: "bg-console-subtle border-console-border",
    elevated: "bg-console-elevated border-console-borderHover shadow-sm"
  };

  return (
    <div
      className={`border rounded-md ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
