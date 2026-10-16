import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ icon, rightElement, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 text-console-muted pointer-events-none shrink-0">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full bg-console-subtle border border-console-border text-console-text placeholder:text-console-dim text-sm rounded px-3 py-2 transition-colors focus:outline-none focus:border-console-accent focus:ring-1 focus:ring-console-accent disabled:opacity-50 ${
              icon ? "pl-9" : ""
            } ${rightElement ? "pr-10" : ""} ${
              error ? "border-console-danger" : ""
            } ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 flex items-center shrink-0">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-xs text-console-danger font-mono">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
