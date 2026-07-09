"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-11 items-center justify-center rounded-[4px] border-2 border-gray-950 bg-accent-600 px-4 text-sm font-bold text-white shadow-neo-sm transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-soft hover:bg-accent-700"
    >
      印刷
    </button>
  );
}
