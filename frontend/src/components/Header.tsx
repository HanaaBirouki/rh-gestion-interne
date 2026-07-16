import { useMemo, useState } from "react";
import {
  Bell,
  HelpCircle,
  Search,
  UserRound,
  X,
} from "lucide-react";

const searchableItems = [
  {
    label: "Mon profil",
    href: "/profile",
  },
  {
    label: "Mes congés",
    href: "/leaves",
  },
  {
    label: "Documents officiels",
    href: "/documents",
  },
  {
    label: "Bulletins de paie",
    href: "/payslips",
  },
  {
    label: "Demandes de documents",
    href: "/requests",
  },
];

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [search, setSearch] = useState("");

  const searchResults = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return [];
    }

    return searchableItems.filter((item) =>
      item.label.toLowerCase().includes(normalizedSearch)
    );
  }, [search]);

  const closeAllMenus = () => {
    setShowNotifications(false);
    setShowHelp(false);
    setShowProfileMenu(false);
  };

  const toggleNotifications = () => {
    setShowNotifications((current) => !current);
    setShowHelp(false);
    setShowProfileMenu(false);
  };

  const toggleHelp = () => {
    setShowHelp((current) => !current);
    setShowNotifications(false);
    setShowProfileMenu(false);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu((current) => !current);
    setShowNotifications(false);
    setShowHelp(false);
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 lg:px-8">
      {/* Recherche */}
      <div className="relative w-full max-w-xl">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher dans WAMA RH..."
          className="h-11 w-full rounded-xl border border-slate-200 bg-[#F7F9FD] pl-11 pr-10 text-sm text-slate-700 outline-none transition focus:border-[#2F67F6] focus:bg-white focus:ring-4 focus:ring-[#2F67F6]/10"
        />

        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Effacer la recherche"
          >
            <X size={16} />
          </button>
        )}

        {search && (
          <div className="absolute left-0 right-0 top-14 z-50 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
            {searchResults.length > 0 ? (
              <div className="p-2">
                {searchResults.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-[#F1F5FF] hover:text-[#1742A0]"
                  >
                    <Search size={16} />
                    {item.label}
                  </a>
                ))}
              </div>
            ) : (
              <p className="px-4 py-4 text-sm text-slate-500">
                Aucun résultat trouvé.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="ml-6 flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={toggleNotifications}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-[#F1F5FF] hover:text-[#1742A0]"
            aria-label="Notifications"
          >
            <Bell size={19} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
              <div className="flex items-center justify-between">
                <p className="font-bold text-[#0F2557]">
                  Notifications
                </p>

                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mt-4 rounded-xl bg-[#F5F7FC] p-4">
                <p className="text-sm font-semibold text-[#0F2557]">
                  Aucune nouvelle notification
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Les changements de statut de vos congés et de vos demandes
                  apparaîtront ici.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Aide */}
        <div className="relative">
          <button
            type="button"
            onClick={toggleHelp}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-[#F1F5FF] hover:text-[#1742A0]"
            aria-label="Aide"
          >
            <HelpCircle size={19} />
          </button>

          {showHelp && (
            <div className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
              <div className="flex items-center justify-between">
                <p className="font-bold text-[#0F2557]">
                  Besoin d’aide ?
                </p>

                <button
                  type="button"
                  onClick={() => setShowHelp(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p>
                  Utilisez le menu à gauche pour consulter votre profil, vos
                  congés, vos documents et vos demandes.
                </p>

                <p>
                  Pour modifier vos informations personnelles, ouvrez la page
                  Profil puis cliquez sur Enregistrer.
                </p>

                <p>
                  Pour télécharger un fichier, cliquez sur le bouton
                  Télécharger correspondant.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mx-1 h-8 w-px bg-slate-200" />

        {/* Profil */}
        <div className="relative">
          <button
            type="button"
            onClick={toggleProfileMenu}
            className="flex items-center gap-3 rounded-xl px-2 py-1.5 text-left transition hover:bg-[#F1F5FF]"
          >
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-[#0F2557]">
                Marwa Boubekri
              </p>

              <p className="text-xs text-slate-500">
                Employée
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#DDE7FF] text-sm font-bold text-[#1742A0]">
              MB
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-14 z-50 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
              <div className="border-b border-slate-100 px-3 py-3">
                <p className="font-semibold text-[#0F2557]">
                  Marwa Boubekri
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Espace employé WAMA RH
                </p>
              </div>

              <a
                href="/profile"
                className="mt-2 flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-[#F1F5FF] hover:text-[#1742A0]"
              >
                <UserRound size={18} />
                Voir mon profil
              </a>
            </div>
          )}
        </div>
      </div>

      {(showNotifications || showHelp || showProfileMenu) && (
        <button
          type="button"
          aria-label="Fermer les menus"
          onClick={closeAllMenus}
          className="fixed inset-0 z-20 cursor-default"
        />
      )}
    </header>
  );
}