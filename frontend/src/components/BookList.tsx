import { useContext, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AppContext } from "../contexts/appContext";
import { AppContextType, IBook } from "../@types/context";
import { IBookListProps } from "../@types/bookList";
import axios from 'axios';

const BookList: React.FC<IBookListProps> = ({ path }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(`${searchParams}` ? decodeURI(`${searchParams}`.split("q=")[1]) : "");
  const isSearch = path === "/search"
  const { books } = useContext(AppContext) as AppContextType;
  const [filteredBooks, setFilteredBooks] = useState<IBook []>(books);
  const [searchedBooks, setSearchedBooks] = useState<IBook []>([]);

  useEffect(() => {
    if (!searchedBooks.length) {
      setFilteredBooks(books);
    } else {
      setFilteredBooks(searchedBooks);
    }
  }, [books])

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      query && axios.get(`http://localhost:4000/search-books/${query}`)
      .then(res => {
        setSearchedBooks(res.data)
      })
      .catch(err => {
        console.error(err);
      })

      if (!query) {
        setSearchedBooks(books)
      }
    }, 500)

    return () => clearTimeout(debounceTimeout)
  }, [query])

  const submitSearch = () => {
    if (query) {
      const params = encodeURI(`q=${query}`)
      setSearchParams(params);
    } else {
      setSearchParams("")
      setSearchedBooks(books)
    }

    setFilteredBooks(searchedBooks);
  }

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
