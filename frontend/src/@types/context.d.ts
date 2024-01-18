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
  setQuery: (query) => void;
  submitSearch: () => void;
  fetchBooks: () => void;
  setFilteredBooks: (books) => void;
  setSearchedBooks: (books) => void;
  toggleFavoriteById: (number) => void;
};
