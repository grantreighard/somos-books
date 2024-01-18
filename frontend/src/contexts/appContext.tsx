import React, {
  useEffect,
  useState,
  createContext,
  PropsWithChildren,
} from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { AppContextType, IBook } from "../@types/context";

export const AppContext = createContext<AppContextType | null>(null);

const ContextProvider = ({ children }: PropsWithChildren) => {
  const { isAuthenticated } = useAuth0();

  const [books, setBooks] = useState<IBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<IBook[]>(books);
  const [searchedBooks, setSearchedBooks] = useState<IBook[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(
    `${searchParams}` ? decodeURI(`${searchParams}`.split("q=")[1]) : ""
  );

  useEffect(() => {
    if (!searchedBooks.length) {
      setFilteredBooks(books);
    } else {
      setFilteredBooks(searchedBooks);
    }
  }, [books]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      query &&
        axios
          .get(`http://localhost:4000/search-books/${query}`)
          .then((res) => {
            setSearchedBooks(res.data);
          })
          .catch((err) => {
            console.error(err);
          });

      if (!query) {
        setSearchedBooks(books);
      }
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [query]);

  const fetchBooks = () => {
    axios
      .get("http://localhost:4000/books")
      .then((res) => {
        setBooks(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const submitSearch = () => {
    if (query) {
      const params = encodeURI(`q=${query}`);
      setSearchParams(params);
    } else {
      setSearchParams("");
      setSearchedBooks(books);
    }

    setFilteredBooks(searchedBooks);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBooks();
    }
  }, [isAuthenticated]);

  return (
    <AppContext.Provider
      value={{
        query,
        books,
        filteredBooks,
        searchedBooks,
        searchParams,
        fetchBooks,
        setFilteredBooks,
        setSearchedBooks,
        setQuery,
        submitSearch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default ContextProvider;
