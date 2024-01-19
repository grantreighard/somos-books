import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { AppContext } from "../contexts/appContext";
import { AppContextType } from "../@types/context";
import ThemeSwitcher from "./ThemeSwitcher";

const Header = () => {
  const navigate = useNavigate()
  const { setIsAuthenticated} = useContext(AppContext) as AppContextType;

  const submitLogout = () => {
    axios.get("http://localhost:4000/api/users/logout")
      .then(res => {
        setIsAuthenticated(false)
        navigate("/login")
      })
  }

  return (
    <div className="relative w-screen flex h-[50px] items-center justify-center dark:text-white bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900">
      <ThemeSwitcher />
      <nav>
        <ol className="w-[400px] flex justify-center">
          <li className="m-2">
            <Link to="/search">Search</Link>
          </li>
          <li className="m-2">
            <Link to="/favorites">Favorites</Link>
          </li>
          <li
            className="m-2 cursor-pointer"
            onClick={() => submitLogout()}
          >
            Log out
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default Header;
