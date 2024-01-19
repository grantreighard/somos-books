import { useContext, useEffect } from "react";
import { AppContext } from "../contexts/appContext";
import { AppContextType } from "../@types/context";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation, useNavigate } from "react-router-dom";

const ThemeSwitcher = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useContext(AppContext) as AppContextType;

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !["/", "/login"].includes(location.pathname)) {
      navigate("/login")
    }
  }, [isLoading, isAuthenticated, location.pathname, navigate])

  return <div className="absolute top-[10px] right-[20px] rounded-full bg-gray-200 dark:bg-gray-900">
    <button onClick={() => setTheme("light")} disabled={theme === "light"} className={theme === "dark" ? "filter grayscale mr-2" : "mr-2"}>🌞</button>
    <button onClick={() => setTheme("dark")} disabled={theme === "dark"} className={theme === "light" ? "filter grayscale" : ""}>🌒</button>
  </div>;
};

export default ThemeSwitcher;
