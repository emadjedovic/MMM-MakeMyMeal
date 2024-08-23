import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import { ThemeContext } from "../contexts/ThemeContext";

function ThemedButton({
  variant,
  onClick,
  className,
  style,
  disabled,
  size,
  ariaLabel,
  type,
  children,
  ...rest
}) {
  const { theme } = useContext(ThemeContext);
  const adjustedVariant =
    theme === "dark" ? "light" : variant || "outline-dark";

  return (
    <Button
      variant={adjustedVariant}
      onClick={onClick}
      className={className}
      style={style}
      disabled={disabled}
      size={size}
      aria-label={ariaLabel}
      type={type}
      {...rest}
    >
      {children}
    </Button>
  );
}

export default ThemedButton;
