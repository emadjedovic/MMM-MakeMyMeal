import React, { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import ThemedButton from "./ThemedButton";
import BackgroundMusic from "./BackgroundMusic";

function Header() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="header">
      <BackgroundMusic />
      <ThemedButton
        onClick={toggleTheme}
        variant="dark"
        className="theme-toggle-button"
      >
        {theme === "light" ? "Dark Mode" : "Light Mode"}
      </ThemedButton>
      {theme === "light" ? (
        <img
          src="/moon.png"
          alt="Switch to Dark Mode"
          style={{
            width: "25px",
            height: "25px",
            marginTop: "5px",
            marginRight: "15px",
          }}
        />
      ) : (
        <img
          src="/sun.png"
          alt="Switch to Light Mode"
          style={{
            width: "35px",
            height: "35px",
            marginRight: "10px",
          }}
        />
      )}
    </header>
  );
}

export default Header;
