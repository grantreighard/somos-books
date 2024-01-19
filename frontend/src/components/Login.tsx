import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../contexts/appContext";
import { AppContextType } from "../@types/context";
import { useNavigate } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher";
import AxiosInstance from '../helpers/api';
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { theme, setIsAuthenticated, setIsLoading, setFavoritesList, setEmail } = useContext(AppContext) as AppContextType;
  const [emailField, setEmailField] = useState("")
  const [password, setPassword] = useState("")

  const submitLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    emailField && password && AxiosInstance
      .post("/api/users/login", { email: emailField, password })
      .then(res => {
        setIsAuthenticated(true);
        setFavoritesList(res.data.favoritesList)
        setEmail(res.data.email)
        setIsLoading(false);
        navigate('/search')
        toast("Logged in successfully.", { type: "success", theme })
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
        toast("There was a problem logging in. Please try again.", { type: "error", theme })
      })
  }

  return (
    <div className={`${theme}`}>
      <div className="w-screen h-screen flex flex-col items-center justify-center dark:text-white dark:bg-black">
        <ThemeSwitcher />
        <h1 className="text-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 inline-block text-transparent bg-clip-text">
          Please log in to use Book Finder
        </h1>
        <form className="flex flex-col" onSubmit={submitLogin}>
          <input
            placeholder="Email address"
            value={emailField}
            onChange={(e) => setEmailField(e.target.value)}
            className="border-[1px] rounded-md border-black dark:border-white p-2 mt-2 dark:text-white dark:bg-black w-[300px] mr-2"
          />
          <input
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-[1px] rounded-md border-black dark:border-white p-2 mt-2 dark:text-white dark:bg-black w-[300px] mr-2"
            type="password"
          />
          <button
            type="submit"
            className="border-[1px] border-black dark:border-white p-2 rounded-md mt-2"
          >
            Log In
          </button>
        </form>
        <Link to="/register">Register instead</Link>
      </div>
    </div>
  );
};

export default Login;
