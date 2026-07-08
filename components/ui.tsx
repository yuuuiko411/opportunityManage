import Link from "next/link";
import { clsx } from "clsx";

type Tone = "neutral" | "accent" | "success" | "warning" | "danger";

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
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        <h1 className="text-[1.7rem] font-semibold leading-tight text-gray-950">{title}</h1>
        {description ? <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={clsx("rounded-lg border border-gray-200 bg-white p-5 shadow-soft sm:p-6", className)}>
      {children}
    </section>
  );
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
        "inline-flex min-h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-accent-100",
        variant === "primary" && "bg-accent-600 text-white hover:bg-accent-700",
        variant === "secondary" && "border border-gray-300 bg-white text-gray-800 hover:bg-gray-50",
      )}
    >
      {children}
    </Link>
  );
}

export function SubmitButton({
  children,
  variant = "primary",
}: {
  children: React.ReactNode;
  variant?: "primary" | "danger";
}) {
  return (
    <button
      type="submit"
      className={clsx(
        "inline-flex min-h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-accent-100",
        variant === "primary" && "bg-accent-600 text-white hover:bg-accent-700",
        variant === "danger" && "bg-gray-950 text-white hover:bg-gray-800",
      )}
    >
      {children}
    </button>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={clsx(
        "min-h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-accent-600 focus:ring-2 focus:ring-accent-100",
        props.className,
      )}
    />
  );
}

export function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={clsx(
        "min-h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-950 outline-none transition focus:border-accent-600 focus:ring-2 focus:ring-accent-100",
        props.className,
      )}
    />
  );
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={clsx(
        "min-h-32 w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-accent-600 focus:ring-2 focus:ring-accent-100",
        props.className,
      )}
    />
  );
}

export function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={clsx("grid gap-1.5 text-sm font-medium text-gray-700", className)}>
      <span>{label}</span>
      {children}
    </label>
  );
}

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: Tone }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium",
        tone === "neutral" && "border-gray-200 bg-gray-100 text-gray-700",
        tone === "accent" && "border-accent-100 bg-accent-50 text-accent-700",
        tone === "success" && "border-gray-200 bg-white text-gray-900",
        tone === "warning" && "border-gray-300 bg-gray-50 text-gray-800",
        tone === "danger" && "border-gray-300 bg-gray-100 text-gray-900",
      )}
    >
      {children}
    </span>
  );
}

export function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-semibold text-gray-950">{title}</h2>
      {description ? <p className="mt-1 text-sm leading-6 text-gray-600">{description}</p> : null}
    </div>
  );
}

export function InfoTile({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <div className="mt-1.5 text-sm font-semibold text-gray-950">{value}</div>
    </div>
  );
}
