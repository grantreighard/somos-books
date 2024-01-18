import { useContext } from "react";
import { AppContext } from "../contexts/appContext";
import { AppContextType } from "../@types/context";

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useContext(AppContext) as AppContextType;

  return <div className="absolute top-[10px] right-[10px]">
    <button onClick={toggleTheme}>{theme === "dark" ? "🌞" : "🌑"}</button>
  </div>;
};

export default ThemeSwitcher;
