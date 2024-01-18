import { useContext, useState, useEffect } from "react";
import { AppContext } from "../contexts/appContext";
import { AppContextType, IBook } from "../@types/context";
import { IBookListProps } from "../@types/bookList";
import axios from 'axios';

const BookList: React.FC<IBookListProps> = ({ path }) => {
  const isSearch = path === "/search"
  const { query, books, filteredBooks, searchParams, setQuery, submitSearch } = useContext(AppContext) as AppContextType;

  return (
    <div>
      { isSearch ? <>
        <p>Search through our library of {books.length} books!</p>
        <input placeholder="Search by title or author" value={query} onChange={e => setQuery(e.target.value)} />
        <button onClick={submitSearch} disabled={!query && !`${searchParams}`}>Search</button>
        <p>{filteredBooks.length} results found</p>
        <div className="flex flex-wrap">
          {filteredBooks.map((book: IBook) => {
            return (
              <div className="w-[200px] h-[350px] flex flex-col m-4 overflow-hidden">
                <img
                  src={
                    book.thumbnailUrl ||
                    "https://placehold.co/450x570?text=No+book+cover"
                  }
                  width={190}
                  alt={book.title}
                />
                <p className="overflow-hidden truncate w-40" title={book.title}>{book.title}</p>
                <p>By {book.authors.filter(a => !!a).slice(0, 3).join(", ") || "unknown author"}</p>
              </div>
            );
          })}
        </div></>:
        <><p>Favorites</p></>
      }
      
    </div>
  );
};

export default BookList;
