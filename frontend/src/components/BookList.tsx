import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { AppContext } from "../contexts/appContext";
import { AppContextType } from "../@types/context";
import BookMap from "./BookMap";

const BookList = () => {
  const location = useLocation();

  const isSearch = location.pathname === "/search";
  const isFavorites = location.pathname === "/favorites";
  const {
    query,
    books,
    filteredBooks,
    favoriteBooks,
    searchParams,
    setQuery,
    submitSearch,
    setChangedQuery,
  } = useContext(AppContext) as AppContextType;

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      submitSearch();
    }
  };

  return (
    <div className="min-h-screen h-[100%] dark:text-white dark:bg-black p-4">
      {isSearch && (
        <>
          <p>Search through our library of {books.length} books!</p>
          <input
            placeholder="Search books by title or author"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setChangedQuery(true);
            }}
            onKeyDown={onKeyDown}
            className="border-[1px] rounded-md border-black dark:border-white p-2 mt-2 dark:text-white dark:bg-black w-[300px] mr-2"
          />
          <button
            onClick={submitSearch}
            disabled={!query && !`${searchParams}`}
            className="border-[1px] rounded-md border-black dark:border-white p-2 mt-2 mr-2"
          >
            Search
          </button>
          <button
            className="border-[1px] rounded-md border-black dark:border-white p-2 mt-2"
            onClick={() => {
              setQuery("");
              setChangedQuery(true);
            }}
          >
            Clear
          </button>
          {filteredBooks.length !== books.length && (
            <p>{filteredBooks.length} results found</p>
          )}
          <BookMap books={filteredBooks} />
        </>
      )}

      {isFavorites && (
        <>
          <p>{favoriteBooks.length} favorites</p>
          <BookMap books={favoriteBooks} />
        </>
      )}
    </div>
  );
};

export default BookList;
