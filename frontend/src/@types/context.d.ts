export interface IBook {
  _id: number;
  title: string;
  isbn: string;
  publishedDate: {
    $date: string;
  };
  thumbnailUrl: string;
  shortDescription: string;
  longDescription: string;
  authors: string[];
  categories: string[];
}

export type AppContextType = {
  query: string;
  searchParams: URLSearchParams;
  books: IBook[];
  filteredBooks: IBook[];
  searchedBooks: IBook[];
  favoriteBooks: IBook[];
  favoritesList: number[];
  theme: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  areBooksLoading: boolean;
  setQuery: (query) => void;
  submitSearch: () => void;
  fetchBooks: () => void;
  setFilteredBooks: (books) => void;
  setSearchedBooks: (books) => void;
  toggleFavoriteById: (number) => void;
  toggleTheme: () => void;
  setTheme: (string) => void;
  setIsAuthenticated: (boolean) => void;
  setIsLoading: (boolean) => void;
  setFavoritesList: (number) => void;
  setEmail: (string) => void;
  setSubmittedSearch: (boolean) => void;
};
