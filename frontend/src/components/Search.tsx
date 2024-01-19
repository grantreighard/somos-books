import BookList from "./BookList";
import Header from "./Header";
import { useContext } from "react";
import { AppContext } from "../contexts/appContext";
import { AppContextType } from "../@types/context";

const Search = () => {
  const { theme } = useContext(AppContext) as AppContextType;

  return (
    <div className={theme}>
      <div className={"dark:bg-black"}>
        <Header />
        <h1 className="text-3xl pl-4 pt-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 inline-block text-transparent bg-clip-text">
          Search
        </h1>
        <BookList />
      </div>
    </div>
  );
};

export default Search;
