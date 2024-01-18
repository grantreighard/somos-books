import { Link } from "react-router-dom";
import BookList from "./BookList";
import Header from "./Header";
import { useContext } from "react";
import { AppContext } from "../contexts/appContext";
import { AppContextType } from "../@types/context";

const Search = () => {
  const { theme } = useContext(AppContext) as AppContextType;

  return (
    <div className={theme}>
      <Header />
      <h1 className="text-3xl dark:text-white dark:bg-black">Search</h1>
      <BookList />
    </div>
  );
};

export default Search;
