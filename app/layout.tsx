import type { Metadata } from "next";
import Link from "next/link";
import { BriefcaseBusiness, LayoutDashboard, Settings } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "案件管理",
  description: "個人事業主向けローカル案件管理ツール",
};

const nav = [
  { href: "/", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/projects", label: "案件", icon: BriefcaseBusiness },
  { href: "/settings", label: "設定", icon: Settings },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen antialiased">
        <div className="flex min-h-screen flex-col bg-gray-50 lg:flex-row">
          <aside className="no-print border-b border-gray-200 bg-white/95 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r">
            <div className="flex h-16 items-center border-b border-gray-200 px-5">
              <Link href="/" className="text-lg font-semibold tracking-normal text-gray-950">
                案件管理
              </Link>
            </div>
            <nav className="flex gap-1 overflow-x-auto p-3 lg:flex-col">
              {nav.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-950"
                  >
                    <Icon className="h-4 w-4 text-gray-500" />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
