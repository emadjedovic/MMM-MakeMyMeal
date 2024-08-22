import React, { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import ThemedButton from "./ThemedButton";

function Header() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="header">
      <ThemedButton onClick={toggleTheme} className="theme-toggle-button">
        {theme === "light" ? "Dark Mode" : "Light Mode"}
      </ThemedButton>
    </header>
  );
}

export default Header;
