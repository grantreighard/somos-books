import { useContext, useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { AppContext } from "../contexts/appContext";
import { AppContextType } from "../@types/context";
import { IIndexable } from "../@types/bookList";
import BookMap from "./BookMap";
import LoadingSpinner from "../assets/loading.svg";

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
    areBooksLoading,
    setQuery,
    submitSearch,
    setSubmittedSearch,
  } = useContext(AppContext) as AppContextType;

  const [sortStr, setSortStr] = useState<string>("default");
  const [sortKey, setSortKey] = useState<string>("_id");
  const [sortDirection, setSortDirection] = useState<string>("ascending");

  const sortKeyMap: { [key: string]: string } = useMemo(() => {
    return {
      default: "_id",
      "title-a-z": "title",
      "title-z-a": "title",
      "author-a-z": "authors",
      "author-z-a": "authors",
    };
  }, []);

  function compare(a: IIndexable, b: IIndexable, key: string) {
    let aVar = Array.isArray(a[key]) ? `${a[key][0]}` : a[key];
    let bVar = Array.isArray(b[key]) ? `${b[key][0]}` : b[key];
    aVar = Number.isInteger(aVar) ? aVar : aVar.toLowerCase();
    bVar = Number.isInteger(bVar) ? bVar : bVar.toLowerCase();

    if (aVar < bVar) {
      return sortDirection === "ascending" ? -1 : 1;
    } else if (aVar > bVar) {
      return sortDirection === "ascending" ? 1 : -1;
    }

    return 0;
  }

  useEffect(() => {
    setSortKey(sortKeyMap[sortStr]);

    if (sortStr === "default" || sortStr.includes("a-z")) {
      setSortDirection("ascending");
    } else {
      setSortDirection("decending");
    }
  }, [sortStr, sortKeyMap]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      submitSearch();
    }
  };

  return (
    <div className="min-h-screen h-[100%] dark:text-white dark:bg-black p-4">
      {areBooksLoading && (
        <div className="w-[100%] h-[500px] flex justify-center items-center">
          <img src={LoadingSpinner} alt="loading indicator" width={120} />
        </div>
      )}
      {!areBooksLoading && isSearch && (
        <>
          <p>Search through our library of {books.length} books!</p>
          <input
            placeholder="Search books by title or author"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
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
            className="border-[1px] rounded-md border-black dark:border-white p-2 mt-2 mr-2"
            onClick={() => {
              setQuery("");
              setSubmittedSearch(true);
            }}
          >
            Clear
          </button>
          <select
            className="text-black bg-white dark:text-white dark:bg-black border-[1px] rounded-md border-black dark:border-white p-2 mt-2"
            onChange={(e) => setSortStr(e.target.value)}
          >
            <option value="default">Default sorting</option>
            <option value="title-a-z">Book title ascending</option>
            <option value="title-z-a">Book title decending</option>
            <option value="author-a-z">First author ascending</option>
            <option value="author-z-a">First author decending</option>
          </select>
          {filteredBooks.length !== books.length && (
            <p>{filteredBooks.length} results found</p>
          )}
          <BookMap
            books={filteredBooks.sort((a, b) => compare(a, b, sortKey))}
          />
        </>
      )}

      {!areBooksLoading && isFavorites && (
        <>
          {favoriteBooks.length ? (
            <select
              className="text-black bg-white dark:text-white dark:bg-black border-[1px] rounded-md border-black dark:border-white p-2 mt-2"
              onChange={(e) => setSortStr(e.target.value)}
            >
              <option value="default">Default sorting</option>
              <option value="title-a-z">Book title ascending</option>
              <option value="title-z-a">Book title decending</option>
              <option value="author-a-z">First author ascending</option>
              <option value="author-z-a">First author decending</option>
            </select>
          ) : null}

          {!favoriteBooks.length ? (
            <p>
              No favorites yet. Click the star icon on the top-right corner of a
              book in the Search view to favorite one.
            </p>
          ) : (
            <p>
              {favoriteBooks.length} favorite
              {favoriteBooks.length === 1 ? "" : "s"}
            </p>
          )}
          <BookMap
            books={favoriteBooks.sort((a, b) => compare(a, b, sortKey))}
          />
        </>
      )}
    </div>
  );
};

export default BookList;
