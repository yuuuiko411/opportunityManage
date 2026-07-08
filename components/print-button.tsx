"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-10 items-center justify-center rounded-md bg-accent-600 px-4 text-sm font-medium text-white hover:bg-accent-700"
    >
      印刷
    </button>
  );
}
