import * as React from "react";

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={`block text-sm font-medium text-[#444651] mb-2 ${className || ""}`}
    {...props}
  />
));
Label.displayName = "Label";

export default Label;