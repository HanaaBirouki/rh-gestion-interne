import { useEffect, useMemo, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  Bell,
  CheckCircle2,
  Clock3,
  HelpCircle,
  Search,
  X,
} from "lucide-react"

const searchItems = [
  {
    label: "Profil",
    description: "Consulter et modifier mes informations",
    path: "/profile",
    keywords: [
      "profil",
      "information",
      "informations",
      "telephone",
      "téléphone",
      "adresse",
      "photo",
    ],
  },
  {
    label: "Congés",
    description: "Créer une demande et consulter mes congés",
    path: "/employee/leaves",
    keywords: [
      "conge",
      "congé",
      "conges",
      "congés",
      "maladie",
      "rtt",
      "absence",
      "vacances",
    ],
  },
  {
    label: "Documents",
    description: "Consulter et télécharger mes documents",
    path: "/employee/documents",
    keywords: [
      "document",
      "documents",
      "contrat",
      "cnss",
      "telecharger",
      "télécharger",
    ],
  },
  {
    label: "Bulletins",
    description: "Consulter mes bulletins de paie",
    path: "/employee/payslips",
    keywords: [
      "bulletin",
      "bulletins",
      "paie",
      "salaire",
      "fiche de paie",
    ],
  },
  {
    label: "Demandes",
    description: "Demander une attestation ou un certificat",
    path: "/employee/requests",
    keywords: [
      "demande",
      "demandes",
      "attestation",
      "certificat",
      "attestation de travail",
      "attestation de salaire",
    ],
  },
]

const notifications = [
  {
    id: 1,
    title: "Demande de document",
    message: "Votre demande est en cours de traitement.",
    type: "pending",
  },
  {
    id: 2,
    title: "Demande de congé",
    message: "Votre demande est toujours en attente.",
    type: "pending",
  },
  {
    id: 3,
    title: "Profil mis à jour",
    message: "Vos informations ont été enregistrées.",
    type: "success",
  },
]

const normalizeText = (text = "") =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()

  const headerRef = useRef(null)
  const inputRef = useRef(null)
  const notificationsRef = useRef(null)
  const helpRef = useRef(null)

  const [search, setSearch] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  const filteredItems = useMemo(() => {
    const query = normalizeText(search)

    if (!query) {
      return searchItems
    }

    return searchItems.filter((item) => {
      const searchableText = [
        item.label,
        item.description,
        ...item.keywords,
      ]
        .map(normalizeText)
        .join(" ")

      return searchableText.includes(query)
    })
  }, [search])

  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target

      if (
        headerRef.current &&
        !headerRef.current.contains(target)
      ) {
        setIsSearchOpen(false)
      }

      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(target)
      ) {
        setShowNotifications(false)
      }

      if (
        helpRef.current &&
        !helpRef.current.contains(target)
      ) {
        setShowHelp(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSelect = (path) => {
    navigate(path)
    setSearch("")
    setIsSearchOpen(false)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (filteredItems.length > 0) {
      handleSelect(filteredItems[0].path)
    }
  }

  const handleHeaderClick = (event) => {
    if (event.target.closest("[data-no-search]")) {
      return
    }

    inputRef.current?.focus()
    setIsSearchOpen(true)
  }

  const handleClear = (event) => {
    event.stopPropagation()
    setSearch("")
    setIsSearchOpen(true)
    inputRef.current?.focus()
  }

  const toggleNotifications = () => {
    setShowNotifications((current) => !current)
    setShowHelp(false)
    setIsSearchOpen(false)
  }

  const toggleHelp = () => {
    setShowHelp((current) => !current)
    setShowNotifications(false)
    setIsSearchOpen(false)
  }

  return (
    <header
      ref={headerRef}
      onClick={handleHeaderClick}
      className="sticky top-0 z-40 flex h-20 w-full cursor-text items-center gap-6 border-b border-slate-200 bg-white px-6 lg:px-8"
    >
      {/* Recherche */}
      <form
        onSubmit={handleSubmit}
        className="relative min-w-0 flex-1"
      >
        <div className="relative w-full">
          <Search
            size={19}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setIsSearchOpen(true)
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Rechercher dans WAMA RH..."
            autoComplete="off"
            className="h-12 w-full rounded-xl border border-slate-200 bg-[#F7F9FD] pl-12 pr-12 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#2F67F6] focus:bg-white focus:ring-4 focus:ring-[#2F67F6]/10"
          />

          {search && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Effacer la recherche"
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={17} />
            </button>
          )}
        </div>

        {isSearchOpen && (
          <div className="absolute left-0 right-0 top-14 z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            {filteredItems.length > 0 ? (
              <div className="p-2">
                {filteredItems.map((item) => (
                  <button
                    key={item.path}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      handleSelect(item.path)
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition hover:bg-blue-50"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#0F2557]">
                        {item.label}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {item.description}
                      </p>
                    </div>

                    {location.pathname === item.path && (
                      <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                        Page actuelle
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-6 py-7 text-center">
                <p className="text-sm font-semibold text-slate-700">
                  Aucun résultat trouvé
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Essayez profil, congé, document, bulletin ou demande.
                </p>
              </div>
            )}
          </div>
        )}
      </form>

      {/* Partie droite */}
      <div
        data-no-search
        className="flex shrink-0 cursor-default items-center gap-3"
      >
        {/* Notifications */}
        <div ref={notificationsRef} className="relative">
          <button
            type="button"
            aria-label="Notifications"
            onClick={toggleNotifications}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-[#F1F5FF] hover:text-[#1742A0]"
          >
            <Bell size={19} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
              <div className="border-b border-slate-100 px-4 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-[#0F2557]">
                      Notifications
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {notifications.length} notification
                      {notifications.length > 1 ? "s" : ""}
                    </p>
                  </div>

                  <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
                    {notifications.length}
                  </span>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto p-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex gap-3 rounded-xl p-3 transition hover:bg-slate-50"
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        notification.type === "success"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {notification.type === "success" ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        <Clock3 size={18} />
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {notification.title}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 p-3">
                <button
                  type="button"
                  onClick={() => {
                    navigate("/employee/requests")
                    setShowNotifications(false)
                  }}
                  className="w-full rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-semibold text-[#2457D6] transition hover:bg-blue-100"
                >
                  Voir les demandes
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Aide */}
        <div ref={helpRef} className="relative">
          <button
            type="button"
            aria-label="Aide"
            onClick={toggleHelp}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-[#F1F5FF] hover:text-[#1742A0]"
          >
            <HelpCircle size={19} />
          </button>

          {showHelp && (
            <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#2F67F6]">
                <HelpCircle size={21} />
              </div>

              <h3 className="mt-4 font-semibold text-[#0F2557]">
                Besoin d’aide ?
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Utilisez le menu à gauche pour accéder à votre profil,
                vos congés, vos documents, vos bulletins et vos
                demandes administratives.
              </p>

              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    navigate("/employee/requests")
                    setShowHelp(false)
                  }}
                  className="w-full rounded-xl bg-[#2F67F6] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2457D6]"
                >
                  Faire une demande
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigate("/employee/documents")
                    setShowHelp(false)
                  }}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Consulter les documents
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mx-1 h-8 w-px bg-slate-200" />

        {/* Utilisateur */}
        <div className="flex items-center gap-3 rounded-xl px-2 py-1">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-[#0F2557]">
              Marwa Boubekri
            </p>

            <p className="text-xs text-slate-500">
              Employée
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#DDE7FF] text-sm font-bold text-[#1742A0] shadow-sm">
            MB
          </div>
        </div>
      </div>
    </header>
  )
}