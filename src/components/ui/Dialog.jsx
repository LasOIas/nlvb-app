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

export function DialogDescription({ children }) {
  return <p className="text-gray-600 mb-2">{children}</p>;
}

export function DialogHeader({ children }) {
  return <div className="mb-4">{children}</div>;
}

// ✅ Correct export block including all components
export {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
};
