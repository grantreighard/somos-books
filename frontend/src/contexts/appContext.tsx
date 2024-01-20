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

  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(
    sessionStorage.getItem("somos-books-query" || "") || `${location.search}`
      ? `${location.search}`.split("q=")[1]?.replace("+", " ")
      : ""
  );

  const [books, setBooks] = useState<IBook[]>(
    JSON.parse(sessionStorage.getItem("somos-books-list") || "[]")
  );

  const [searchedBooks, setSearchedBooks] = useState<IBook[]>(
    JSON.parse(sessionStorage.getItem("somos-books-searched") || "[]")
  );

  const [filteredBooks, setFilteredBooks] = useState<IBook[]>(
    query && searchedBooks.length ? searchedBooks : books
  );

  const [favoriteBooks, setFavoriteBooks] = useState<IBook[]>(
    JSON.parse(sessionStorage.getItem("somos-books-favorites") || "[]")
  );

  const [areBooksLoading, setAreBooksLoading] = useState(false);
  const [favoritesList, setFavoritesList] = useState<number[]>(
    JSON.parse(sessionStorage.getItem("somos-books-favorites-array") || "[]")
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState(false);
  const [didRefresh, setDidRefresh] = useState(false);

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
          setIsLoading(false);
        });
    }
    // eslint-disable-next-line
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    if (query) {
      sessionStorage.setItem("somos-books-query", query);
    }

    if (!query && submittedSearch) {
      setSearchParams("");
      setFilteredBooks(books);
      sessionStorage.removeItem("somos-books-query");
    }

    if (query && (submittedSearch || didRefresh)) {
      setFilteredBooks(searchedBooks);
      setDidRefresh(false);
    }

    setSubmittedSearch(false);
    // eslint-disable-next-line
  }, [query, submittedSearch, didRefresh]);

  useEffect(() => {
    const sessionQuery = sessionStorage.getItem("somos-books-query");

    if (sessionQuery) {
      setQuery(sessionQuery);
      setSearchParams(`q=${sessionQuery}`);
    }
  }, [location.pathname]);

  useEffect(() => {
    setDidRefresh(true);
  }, []);

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
    const favorites = books?.filter((book) =>
      favoritesList?.includes(book?._id)
    );
    setFavoriteBooks(favorites);
    sessionStorage.setItem(
      "somos-books-favorites-array",
      JSON.stringify(favoritesList)
    );
    sessionStorage.setItem("somos-books-favorites", JSON.stringify(favorites));
  }, [favoritesList, books]);

  const fetchBooks = useCallback(() => {
    const sessionBooks = JSON.parse(
      sessionStorage.getItem("somos-books-list") || "[]"
    );

    const favoritesArray = JSON.parse(
      sessionStorage.getItem("somos-books-favorites-array") || "[]"
    );

    const favorites = JSON.parse(
      sessionStorage.getItem("somos-books-favorites") || "[]"
    );

    const searched = JSON.parse(
      sessionStorage.getItem("somos-books-searched") || "[]"
    );

    setBooks(sessionBooks);
    setFavoriteBooks(favorites);
    setFavoritesList(favoritesArray);
    setSearchedBooks(searched);

    if (!sessionBooks.length) {
      setAreBooksLoading(true);
      AxiosInstance.get("/api/books")
        .then((res) => {
          setBooks(res.data);
          setFilteredBooks(res.data);
          setAreBooksLoading(false);
          sessionStorage.setItem("somos-books-list", JSON.stringify(res.data));
        })
        .catch((err) => {
          setAreBooksLoading(false);
          toast("There was an issue fetching books. Please try again.", {
            type: "error",
            theme,
          });
        });
    }
    // eslint-disable-next-line
  }, []);

  const submitSearch = () => {
    setSubmittedSearch(true);

    if (query) {
      const params = encodeURI(`q=${query}`);
      setSearchParams(params);
    } else {
      setSearchParams("");
      setSearchedBooks(books);
    }

    setFilteredBooks(searchedBooks);
    sessionStorage.setItem(
      "somos-books-searched",
      JSON.stringify(searchedBooks)
    );
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
        setIsAuthenticated,
        setIsLoading,
        setFavoritesList,
        setEmail,
        setSubmittedSearch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default ContextProvider;
