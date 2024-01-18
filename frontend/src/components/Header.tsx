import { Link, useLocation } from 'react-router-dom';
import ThemeSwitcher from "./ThemeSwitcher";

const Header = () => {
    const location = useLocation();

    return (
        <div className="relative w-screen flex h-[50px] items-center justify-center bg-amber-100">
            <ThemeSwitcher />
            <nav>
                <ol className="w-[400px] flex justify-center">
                    <li className="m-2"><Link to="/search">Search</Link></li>
                    <li className="m-2"><Link to="/favorites">Favorites</Link></li>
                    <li className="m-2">Log out</li>
                </ol>
            </nav>
        </div>
    )
}

export default Header;