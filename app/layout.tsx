import type { Metadata } from "next";
import Link from "next/link";
import { BriefcaseBusiness, LayoutDashboard, Settings } from "lucide-react";
import { IBM_Plex_Sans, Noto_Sans_JP, Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-rubik",
});

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-sans-jp",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-ibm-plex-sans",
});

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
      <body className={`${rubik.variable} ${notoSansJp.variable} ${ibmPlexSans.variable} min-h-screen antialiased`}>
        <div className="flex min-h-screen flex-col bg-[#f5f1e8] lg:flex-row">
          <aside className="no-print border-b-2 border-gray-950 bg-[#fde047] lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r-2">
            <div className="flex h-20 items-center border-b-2 border-gray-950 px-5">
              <Link href="/" className="inline-flex rounded-[4px] border-2 border-gray-950 bg-white px-3 py-1.5 text-lg font-black tracking-tight shadow-neo-sm">
                案件管理。
              </Link>
            </div>
            <nav className="flex gap-2 overflow-x-auto p-3 lg:flex-col lg:p-4">
              {nav.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex min-h-11 items-center gap-3 rounded-[4px] border-2 border-transparent px-3 py-2 text-sm font-bold text-gray-950 transition hover:border-gray-950 hover:bg-white hover:shadow-neo-sm"
                  >
                    <Icon className="h-4 w-4" strokeWidth={2.5} />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
