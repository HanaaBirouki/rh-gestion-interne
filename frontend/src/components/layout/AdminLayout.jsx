// frontend/src/components/layout/AdminLayout.jsx

import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  UserPlus,
  FileText,
  Wallet,
  CalendarCheck,
  FileCheck,
  LogOut,
} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";
import logo from "../../assets/screen.png";
const navItems = [
  {
    to: "/admin/dashboard",
    label: "Tableau de bord",
    icon: LayoutDashboard,
  },

  {
    to: "/admin/collaborators",
    label: "Collaborateurs",
    icon: Users,
  },

  {
    to: "/admin/collaborators/create",
    label: "Nouveau collaborateur",
    icon: UserPlus,
  },

  {
    to: "/admin/documents",
    label: "Documents",
    icon: FileText,
  },

  {
    to: "/admin/payslips",
    label: "Bulletins de paie",
    icon: Wallet,
  },

  {
    to: "/admin/leave-requests",
    label: "Demandes de congés",
    icon: CalendarCheck,
  },

  {
    to: "/admin/document-requests",
    label: "Demandes de documents",
    icon: FileCheck,
  },
];

export default function AdminLayout() {
  const { logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F7FC]">

      {/* SIDEBAR */}

      <aside className="flex h-screen w-[290px] shrink-0 flex-col bg-[#1E3A8A] text-white shadow-xl">

        {/* LOGO */}

        <div className="flex min-h-[130px] items-center border-b border-white/10 px-6">

          <div className="flex items-center gap-4">

            <div
className="
flex
h-20
w-20
items-center
justify-center
rounded-2xl
bg-white
p-2
shadow-lg
"
>

    <img
        src={logo}
        alt="WAMA RH"
        className="h-full w-full object-contain"
    />

</div>

            <div>

              <h2
className="
text-2xl
font-bold
tracking-tight
text-white
"
>
    WAMA RH
</h2>


<p
className="
mt-1
text-xs
font-semibold
uppercase
tracking-[0.18em]
text-blue-200
"
>
    Espace Administrateur
</p>

            </div>

          </div>

        </div>


        {/* MENU */}

        <nav className="flex-1 overflow-y-auto px-4 py-7">

          <p
            className="
            mb-4
            px-3
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.18em]
            text-blue-200
            "
          >
            Navigation
          </p>


          <div className="space-y-2">

            {navItems.map(({ to, label, icon: Icon }) => (

              <NavLink
    key={to}
    to={to}
    end={to !== "/admin/dashboard"}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-3.5 text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-[#2F67F6] text-white shadow-[0_10px_24px_rgba(47,103,246,0.28)]"
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
                        isActive
                          ? "bg-white/15 text-white"
                          : "bg-white/10 text-blue-100 group-hover:bg-white/15 group-hover:text-white"
                      }`}
                    >
                      <Icon
                        size={19}
                        strokeWidth={1.9}
                      />
                    </span>

                    <span>{label}</span>
                  </>
                )}
              </NavLink>

            ))}

          </div>


          {/* DECONNEXION */}

          <button
            type="button"
            onClick={handleLogout}
            className="
            mt-6
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            px-3
            py-3.5
            text-sm
            font-semibold
            text-red-200
            transition-all
            duration-300
            hover:bg-red-500/20
            hover:text-white
            "
          >
            <span
              className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-lg
              bg-red-500/10
              "
            >
              <LogOut
                size={19}
                strokeWidth={1.9}
              />
            </span>

            <span>Déconnexion</span>

          </button>

        </nav>


        {/* FOOTER */}

        <div className="border-t border-white/10 p-4">

          <div
            className="
            rounded-2xl
            border
            border-white/10
            bg-white/10
            p-4
            "
          >
            <p className="text-sm font-bold text-white">
              WAMA INVEST
            </p>

            <p className="mt-1 text-xs leading-5 text-blue-100">
              Gérez les collaborateurs, documents, congés et bulletins de paie.
            </p>
          </div>

          <p className="mt-4 text-center text-[11px] text-blue-200/80">
            © 2026 WAMA INVEST Group
          </p>

        </div>

      </aside>


      {/* CONTENU */}

      <main className="min-w-0 flex-1 overflow-y-auto bg-[#F4F7FC] p-8">

        <Outlet />

      </main>

    </div>
  );
}