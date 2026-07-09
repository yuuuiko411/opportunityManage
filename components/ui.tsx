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
        <div className="mb-3 h-2 w-14 bg-accent-600" />
        <h1 className="text-[2rem] font-black leading-tight tracking-tight text-gray-950 sm:text-4xl">{title}</h1>
        {description ? <p className="mt-2 text-sm font-medium leading-6 text-gray-700">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={clsx("rounded-[4px] border-2 border-gray-950 bg-white p-5 shadow-soft sm:p-6", className)}>
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
        "inline-flex min-h-11 items-center justify-center rounded-[4px] border-2 border-gray-950 px-4 text-sm font-bold shadow-neo-sm transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-soft focus:outline-none focus:ring-4 focus:ring-accent-100",
        variant === "primary" && "bg-accent-600 text-white hover:bg-accent-700",
        variant === "secondary" && "bg-white text-gray-950 hover:bg-[#fde047]",
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
        "inline-flex min-h-11 items-center justify-center rounded-[4px] border-2 border-gray-950 px-4 text-sm font-bold shadow-neo-sm transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-soft focus:outline-none focus:ring-4 focus:ring-accent-100",
        variant === "primary" && "bg-accent-600 text-white hover:bg-accent-700",
        variant === "danger" && "bg-[#fb7185] text-gray-950 hover:bg-[#f43f5e]",
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
        "min-h-11 w-full rounded-[4px] border-2 border-gray-950 bg-white px-3 text-sm font-medium text-gray-950 outline-none transition placeholder:text-gray-400 focus:-translate-y-0.5 focus:shadow-neo-sm focus:ring-4 focus:ring-accent-100",
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
        "min-h-11 w-full rounded-[4px] border-2 border-gray-950 bg-white px-3 text-sm font-medium text-gray-950 outline-none transition focus:-translate-y-0.5 focus:shadow-neo-sm focus:ring-4 focus:ring-accent-100",
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
        "min-h-32 w-full rounded-[4px] border-2 border-gray-950 bg-white px-3 py-2.5 text-sm font-medium text-gray-950 outline-none transition placeholder:text-gray-400 focus:-translate-y-0.5 focus:shadow-neo-sm focus:ring-4 focus:ring-accent-100",
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
    <label className={clsx("grid gap-1.5 text-sm font-bold text-gray-950", className)}>
      <span>{label}</span>
      {children}
    </label>
  );
}

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: Tone }) {
  return (
    <span
      className={clsx(
        "ui-label inline-flex items-center rounded-[4px] border-2 border-gray-950 px-2.5 py-1 text-xs",
        tone === "neutral" && "bg-gray-100 text-gray-950",
        tone === "accent" && "bg-[#c7d2fe] text-gray-950",
        tone === "success" && "bg-[#86efac] text-gray-950",
        tone === "warning" && "bg-[#fde047] text-gray-950",
        tone === "danger" && "bg-[#fb7185] text-gray-950",
      )}
    >
      {children}
    </span>
  );
}

export function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-black text-gray-950">{title}</h2>
      {description ? <p className="mt-1 text-sm leading-6 text-gray-600">{description}</p> : null}
    </div>
  );
}

export function InfoTile({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-[4px] border-2 border-gray-950 bg-[#f5f1e8] px-4 py-3">
      <p className="ui-label text-xs uppercase tracking-wide text-gray-600">{label}</p>
      <div className="mt-1.5 text-sm font-semibold text-gray-950">{value}</div>
    </div>
  );
}
