import { useContext } from "react";
import { AppContext } from "../contexts/appContext";
import { AppContextType } from "../@types/context";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useContext(AppContext) as AppContextType;

  return (
    <div className="absolute top-[10px] right-[20px] rounded-full bg-gray-300 dark:bg-gray-900 pl-[5px] pr-[5px]">
      <button
        onClick={() => setTheme("light")}
        disabled={theme === "light"}
        className={theme === "dark" ? "filter grayscale mr-2" : "mr-2"}
      >
        🌞
      </button>
      <button
        onClick={() => setTheme("dark")}
        disabled={theme === "dark"}
        className={theme === "light" ? "filter grayscale" : ""}
      >
        🌒
      </button>
    </div>
  );
};

export default ThemeSwitcher;
