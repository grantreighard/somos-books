import React, { useEffect, createContext, PropsWithChildren } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { AppContextType, IBook } from "../@types/context";

export const AppContext = createContext<AppContextType | null>(null);

const ContextProvider = ({ children }: PropsWithChildren) => {
  const { isAuthenticated } = useAuth0();

  const [books, setBooks] = React.useState<IBook[]>([]);

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

  useEffect(() => {
    if (isAuthenticated) {
      fetchBooks();
    }
  }, [isAuthenticated]);

  return (
    <AppContext.Provider value={{ books, fetchBooks }}>
      {children}
    </AppContext.Provider>
  );
};

export default ContextProvider;
