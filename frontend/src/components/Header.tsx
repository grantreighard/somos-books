import { Link } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher";
import { useAuth0 } from "@auth0/auth0-react";

const Header = () => {
  const { logout } = useAuth0();

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
            onClick={() => {
              logout({ logoutParams: { returnTo: "http://localhost:3000" } });
            }}
          >
            Log out
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default Header;
