// frontend/src/components/layout/PageHeader.jsx
import React from "react"

const PageHeader = ({ title, subtitle, icon: Icon, action }) => {
  return (
    <div className="bg-white border-b border-outline-variant px-8 py-6 mb-6 flex items-center justify-between rounded-t-xl">
      <div className="flex items-center gap-4">
        {Icon && (
          <div className="w-11 h-11 rounded-lg bg-primary-container flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-on-primary-container" />
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold text-on-surface">{title}</h1>
          {subtitle && <p className="text-sm text-on-surface-variant mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

export default PageHeader