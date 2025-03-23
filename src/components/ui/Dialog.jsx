import * as React from "react";

export function Dialog({ open, children, onOpenChange }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
        {children}
      </div>
    </div>
  );
}

export function DialogTitle({ children }) {
  return <h2 className="text-xl font-bold mb-4">{children}</h2>;
}

export function DialogContent({ children }) {
  return <div>{children}</div>;
}
