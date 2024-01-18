import { useAuth0 } from "@auth0/auth0-react";
import { useContext } from "react";
import { AppContext } from "../contexts/appContext";
import { AppContextType } from "../@types/context";
import ThemeSwitcher from "./ThemeSwitcher";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  const { theme } = useContext(AppContext) as AppContextType;

  return (
    <div className={`${theme}`}>
      <div className="w-screen h-screen flex flex-col items-center justify-center dark:text-white dark:bg-black">
        <ThemeSwitcher />
        <h1 className="text-3xl">Please log in to use Book Finder</h1>
        <button onClick={() => loginWithRedirect()}>Log In</button>
      </div>
    </div>
  );
};

export default LoginButton;
