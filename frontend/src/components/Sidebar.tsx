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
    <aside className="sticky top-0 flex h-screen w-[260px] shrink-0 flex-col border-r border-[#24427D] bg-[#0F2557] text-white">
      {/* Logo */}
      <div className="flex min-h-[120px] items-center border-b border-white/10 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-white p-1 shadow-sm">
            <img
              src={logo}
              alt="WAMA RH"
              className="h-full w-full object-contain"
            />
          </div>

          <div>
            <p className="text-xl font-bold tracking-tight text-white">
              WAMA RH
            </p>

            <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.15em] text-blue-200">
              Espace employé
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <p className="mb-4 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-200">
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
                    ? "bg-[#2457D6] text-white shadow-[0_8px_24px_rgba(0,0,0,0.20)]"
                    : "text-blue-50 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
                    isActive
                      ? "bg-white/15 text-white"
                      : "bg-white/10 text-blue-100 group-hover:bg-white/15 group-hover:text-white"
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
      <div className="border-t border-white/10 p-4">
        <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
          <p className="text-sm font-bold text-white">
            WAMA RH
          </p>

          <p className="mt-1 text-xs leading-5 text-blue-100">
            Gérez vos informations, congés, documents et demandes RH.
          </p>
        </div>
      </div>
    </aside>
  );
}