import { useContext, useEffect } from "react";
import { AppContext } from "../contexts/appContext";
import { AppContextType } from "../@types/context";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation, useNavigate } from "react-router-dom";

const ThemeSwitcher = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useContext(AppContext) as AppContextType;

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !["/", "/login"].includes(location.pathname)) {
      navigate("/login")
    }
  }, [isLoading, isAuthenticated, location.pathname, navigate])

  return <div className="absolute top-[10px] right-[20px]">
    <button onClick={toggleTheme}>{theme === "dark" ? "🌞" : "🌑"}</button>
  </div>;
};

export default ThemeSwitcher;
