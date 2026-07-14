import * as React from "react";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={`w-full pl-10 pr-4 py-3 bg-white border border-[#c5c5d3] rounded-lg text-base focus:ring-2 focus:ring-[#0051d5]/20 focus:border-[#0051d5] outline-none transition-all duration-200 placeholder:text-[#c5c5d3] ${className || ""}`}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export default Input;