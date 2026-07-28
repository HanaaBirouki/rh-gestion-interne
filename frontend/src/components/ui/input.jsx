// frontend/src/components/ui/input.jsx
import * as React from "react"
import { cn } from "../../lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-lg text-base focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all duration-200 placeholder:text-outline-variant disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
export default Input