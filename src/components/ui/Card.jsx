import * as React from "react";

export function Card({ className = "", children }) {
  return (
    <div className={`rounded-xl border border-gray-300 bg-white shadow p-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ className = "", children }) {
  return <div className={className}>{children}</div>;
}
