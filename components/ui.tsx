import Link from "next/link";
import { clsx } from "clsx";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-gray-950">{title}</h1>
        {description ? <p className="mt-1 text-sm text-gray-600">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={clsx("rounded-lg border border-gray-200 bg-white p-5 shadow-soft", className)}>{children}</section>;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex min-h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition",
        variant === "primary" && "bg-accent-600 text-white hover:bg-accent-700",
        variant === "secondary" && "border border-gray-300 bg-white text-gray-800 hover:bg-gray-50",
      )}
    >
      {children}
    </Link>
  );
}

export function SubmitButton({ children, variant = "primary" }: { children: React.ReactNode; variant?: "primary" | "danger" }) {
  return (
    <button
      type="submit"
      className={clsx(
        "inline-flex min-h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition",
        variant === "primary" && "bg-accent-600 text-white hover:bg-accent-700",
        variant === "danger" && "bg-gray-950 text-white hover:bg-gray-800",
      )}
    >
      {children}
    </button>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={clsx("min-h-10 rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-accent-600 focus:ring-2 focus:ring-accent-100", props.className)} />;
}

export function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={clsx("min-h-10 rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-accent-600 focus:ring-2 focus:ring-accent-100", props.className)} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={clsx("min-h-28 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-accent-600 focus:ring-2 focus:ring-accent-100", props.className)} />;
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-gray-700">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">{children}</span>;
}
