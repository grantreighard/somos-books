import {
  useEffect,
  useState,
  useCallback,
  createContext,
  PropsWithChildren,
} from "react";
import AxiosInstance from "../helpers/api";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { AppContextType, IBook } from "../@types/context";
import { toast } from "react-toastify";

export const AppContext = createContext<AppContextType | null>(null);

const ContextProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const location = useLocation();

  const localTheme = localStorage.getItem("somos-books-theme");

  let prefersDarkMode = false;
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    prefersDarkMode = true;
  }

  const [theme, setTheme] = useState(
    localTheme || (prefersDarkMode ? "dark" : "light") || "dark"
  );
  const [books, setBooks] = useState<IBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<IBook[]>(books);
  const [searchedBooks, setSearchedBooks] = useState<IBook[]>([]);
  const [favoriteBooks, setFavoriteBooks] = useState<IBook[]>([]);
  const [areBooksLoading, setAreBooksLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(
    `${searchParams}` ? `${searchParams}`.split("q=")[1]?.replace("+", " ") : ""
  );
  const [changedQuery, setChangedQuery] = useState(false);
  const [clickedSubmit, setClickedSubmit] = useState(false);
  const [favoritesList, setFavoritesList] = useState<number[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    localStorage.setItem("somos-books-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (["/search", "/favorites"].includes(location.pathname)) {
      setIsLoading(true);
      AxiosInstance.get("/api/users/jwt") // allow authentication upon refresh using cookie
        .then((res) => {
          setIsAuthenticated(true);
          setFavoritesList(res.data.favoritesList);
          setEmail(res.data.email);
          setIsLoading(false);
        })
        .catch((err) => {
          navigate("/login");
          setIsLoading(true);
        });
    }
  }, [navigate, location.pathname]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    if (!query && !searchedBooks.length) {
      // reset after query deleted
      setFilteredBooks(books);
      setSearchParams("");
    } else if (!query && changedQuery) {
      // clear button clicked
      setFilteredBooks(books);
      setSearchParams("");
    } else if (clickedSubmit && query && !searchedBooks.length) {
      // submit button clicked, no matching results
      setFilteredBooks([]);
      setClickedSubmit(false);
    } else if (!changedQuery && searchedBooks.length) {
      // browser refresh
      setFilteredBooks(searchedBooks);
    } else if (clickedSubmit) {
      // submit button clicked
      setFilteredBooks(searchedBooks);
      setClickedSubmit(false);
    }
  }, [
    books,
    searchedBooks,
    clickedSubmit,
    query,
    changedQuery,
    setSearchParams,
  ]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (query) {
        AxiosInstance.get(`/api/books/search/${encodeURI(query)}`)
          .then((res) => {
            setSearchedBooks(res.data);
          })
          .catch((err) => {
            toast("There was an issue searching books. Please try again.", {
              type: "error",
              theme,
            });
          });
      }

      if (!query) {
        setSearchedBooks(books);
      }
    }, 100);

    return () => clearTimeout(debounceTimeout);
  }, [query, books, theme]);

  useEffect(() => {
    setFavoriteBooks(
      books?.filter((book) => favoritesList?.includes(book?._id))
    );
  }, [favoritesList, books]);

  const fetchBooks = useCallback(() => {
    setAreBooksLoading(true);
    AxiosInstance.get("/api/books")
      .then((res) => {
        setBooks(res.data);
        setAreBooksLoading(false);
      })
      .catch((err) => {
        setAreBooksLoading(false);
        toast("There was an issue fetching books. Please try again.", {
          type: "error",
          theme,
        });
      });
    // eslint-disable-next-line
  }, []);

  const submitSearch = () => {
    if (query) {
      const params = encodeURI(`q=${query}`);
      setSearchParams(params);
    } else {
      setSearchParams("");
      setSearchedBooks(books);
    }

    setFilteredBooks(searchedBooks);
    setClickedSubmit(true); // added to clear exhaustive-deps warning on useEffect above
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBooks();
    }
  }, [isAuthenticated, fetchBooks]);

  const toggleFavoriteById = (id: number) => {
    const existingFavorites = favoritesList.slice();
    let editedFavorites = [];

    if (existingFavorites?.includes(id)) {
      editedFavorites = existingFavorites.filter((fav) => fav !== id);
    } else {
      editedFavorites = [...existingFavorites];
      editedFavorites.push(id);
    }

    setFavoritesList(editedFavorites);

    AxiosInstance.put("/api/books/set-favorites", {
      favoritesList: editedFavorites,
      email,
    })
      .then((res) => {})
      .catch((err) => {
        toast("There was an issue favoriting this book. Please try again.", {
          type: "error",
          theme,
        });
      });
  };

  return (
    <AppContext.Provider
      value={{
        query,
        books,
        filteredBooks,
        searchedBooks,
        searchParams,
        favoritesList,
        favoriteBooks,
        theme,
        isAuthenticated,
        isLoading,
        areBooksLoading,
        fetchBooks,
        setFilteredBooks,
        setSearchedBooks,
        setQuery,
        submitSearch,
        toggleFavoriteById,
        toggleTheme,
        setTheme,
        setChangedQuery,
        setIsAuthenticated,
        setIsLoading,
        setFavoritesList,
        setEmail,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default ContextProvider;
