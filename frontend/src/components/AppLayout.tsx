import type { ReactNode } from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";

type AppLayoutProps = {
  children: ReactNode;
  title: string;
  subtitle?: string;
};

export default function AppLayout({
  children,
  title,
  subtitle,
}: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#F5F7FC]">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Header />

        <main className="px-6 py-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-[#0F2557]">
              {title}
            </h1>

            {subtitle && (
              <p className="mt-1 text-sm text-slate-500">
                {subtitle}
              </p>
            )}
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}