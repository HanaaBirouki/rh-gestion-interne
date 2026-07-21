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
    <div className="flex min-h-screen bg-[#F4F7FC]">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Header />

        <main className="min-h-[calc(100vh-80px)] px-6 py-8 lg:px-10">
          <div className="mx-auto w-full max-w-[1500px]">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-[#0F2557] lg:text-4xl">
                {title}
              </h1>

              {subtitle && (
                <p className="mt-2 text-sm leading-6 text-slate-500 lg:text-base">
                  {subtitle}
                </p>
              )}
            </div>

            <div className="w-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}