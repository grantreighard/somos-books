import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import { AppContext } from "./contexts/appContext";
import { AppContextType } from "./@types/context";

function App() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useContext(AppContext) as AppContextType;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    } else if (!isLoading && isAuthenticated) {
      navigate("/search");
    }
  }, [isLoading, isAuthenticated, navigate]);

  return <></>;
}

export default App;
