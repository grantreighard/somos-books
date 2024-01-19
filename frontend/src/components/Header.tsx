import { Link } from 'react-router-dom';
import ThemeSwitcher from "./ThemeSwitcher";
import { useAuth0 } from "@auth0/auth0-react";

const Header = () => {
    const { logout } = useAuth0();

    return (
        <div className="relative w-screen flex h-[50px] items-center justify-center bg-cyan-100 dark:text-white dark:bg-cyan-900">
            <ThemeSwitcher />
            <nav>
                <ol className="w-[400px] flex justify-center">
                    <li className="m-2"><Link to="/search">Search</Link></li>
                    <li className="m-2"><Link to="/favorites">Favorites</Link></li>
                    <li className="m-2 cursor-pointer" onClick={() =>
                        logout({ logoutParams: { returnTo: window.location.origin } })
                    }>Log out</li>
                </ol>
            </nav>
        </div>
    )
}

export default Header;