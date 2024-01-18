import { useContext } from "react";
import { useLocation } from 'react-router-dom';
import { AppContext } from "../contexts/appContext";
import { AppContextType } from "../@types/context";
import BookMap from "./BookMap";

const BookList = () => {
  const location = useLocation();

  const isSearch = location.pathname === "/search"
  const isFavorites = location.pathname === "/favorites"
  const { query, books, filteredBooks, favoriteBooks, searchParams, setQuery, submitSearch } = useContext(AppContext) as AppContextType;

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      submitSearch()
    }
  }

  return (
    <div>
      { isSearch && <>
        <p>Search through our library of {books.length} books!</p>
        <input placeholder="Search by title or author" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={onKeyDown} />
        <button onClick={submitSearch} disabled={!query && !`${searchParams}`}>Search</button>
        <p>{filteredBooks.length} results found</p>
        <BookMap books={filteredBooks}/>
      </>}
      
      { isFavorites && <>
        <p>{favoriteBooks.length} favorites</p>
        <BookMap books={favoriteBooks} />
      </>}
    </div>
  );
};

export default BookList;
