import * as React from "react";

const Button = React.forwardRef(({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";
  
  const variants = {
    default: "bg-[#1e3a8a] text-white hover:bg-[#00236f] shadow-md hover:shadow-lg",
    outline: "border border-[#c5c5d3] text-[#444651] hover:bg-[#eff4ff]",
    ghost: "hover:bg-[#eff4ff] hover:text-[#0b1c30]",
    destructive: "bg-[#ba1a1a] text-white hover:bg-[#ba1a1a]/90",
  };
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-12 rounded-lg px-8",
    icon: "h-10 w-10",
  };
  
  const Comp = asChild ? "span" : "button";
  
  return (
    <Comp
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ""}`}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export default Button;