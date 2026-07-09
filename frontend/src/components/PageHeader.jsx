export default function PageHeader({ title, subtitle, icon: Icon, action }) {
  return (
    <div className="bg-white border-b px-8 py-6 mb-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {Icon && (
          <div className="w-11 h-11 rounded-lg bg-[oklch(0.22_0.06_250)] flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-[oklch(0.75_0.11_210)]" />
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold text-[oklch(0.22_0.06_250)]">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}