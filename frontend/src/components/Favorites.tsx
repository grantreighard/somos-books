import BookList from "./BookList";
import Header from "./Header";
import { useContext } from "react";
import { AppContext } from "../contexts/appContext";
import { AppContextType } from "../@types/context";

const Favorites = () => {
  const { theme } = useContext(AppContext) as AppContextType;

  return (
    <div className={theme}>
      <Header />
      <h1 className="text-3xl dark:text-white dark:bg-black">Favorites</h1>
      <BookList />
    </div>
  );
};

export default Favorites;
