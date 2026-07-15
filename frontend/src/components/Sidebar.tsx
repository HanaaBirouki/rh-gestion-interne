import logo from "../assets/wama-rh-logo.png";

import {
  UserRound,
  CalendarDays,
  Files,
  ReceiptText,
  FileClock,
} from "lucide-react";

const menuItems = [
  {
    name: "Profil",
    icon: UserRound,
    href: "/profile",
  },
  {
    name: "Congés",
    icon: CalendarDays,
    href: "/leaves",
  },
  {
    name: "Documents",
    icon: Files,
    href: "/documents",
  },
  {
    name: "Bulletins",
    icon: ReceiptText,
    href: "/payslips",
  },
  {
    name: "Demandes",
    icon: FileClock,
    href: "/requests",
  },
];

export default function Sidebar() {
  const currentPath = window.location.pathname;

  return (
    <aside className="sticky top-0 flex h-screen w-[260px] shrink-0 flex-col border-r border-[#E3E8F2] bg-white">
      {/* Logo */}
      <div className="flex min-h-[120px] items-center border-b border-[#E3E8F2] px-6">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="WAMA RH"
            className="h-16 w-16 rounded-xl object-contain"
          />

          <div>
            <p className="text-xl font-bold tracking-tight text-[#0F2B68]">
              WAMA RH
            </p>

            <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.15em] text-slate-400">
              Espace employé
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <p className="mb-4 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          Navigation
        </p>

        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              currentPath === item.href ||
              (currentPath === "/" && item.href === "/profile");

            return (
              <a
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#2457D6] text-white shadow-[0_8px_20px_rgba(36,87,214,0.18)]"
                    : "text-slate-600 hover:bg-[#F1F5FF] hover:text-[#1742A0]"
                }`}
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
                    isActive
                      ? "bg-white/15 text-white"
                      : "bg-[#F5F7FC] text-slate-500 group-hover:bg-white group-hover:text-[#1742A0]"
                  }`}
                >
                  <Icon size={19} strokeWidth={1.9} />
                </span>

                <span>{item.name}</span>
              </a>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-[#E3E8F2] p-4">
        <div className="rounded-2xl border border-[#E4EAF5] bg-[#F7F9FD] p-4">
          <p className="text-sm font-bold text-[#0F2B68]">
            WAMA RH
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Gérez vos informations, congés, documents et demandes RH.
          </p>
        </div>
      </div>
    </aside>
  );
}