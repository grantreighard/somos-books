import { useContext } from "react";
import { AppContext } from "../contexts/appContext";
import { AppContextType, IBook } from "../@types/context";

const BookList = () => {
  const { books } = useContext(AppContext) as AppContextType;
  return (
    <div>
      Book List
      <p>Search through our library of {books.length} books!</p>
      <div className="flex flex-wrap">
        {books.map((book: IBook, index) => {
          return (
            <div className="w-44 h-64 flex flex-col m-4 overflow-hidden">
              <img
                src={
                  book.thumbnailUrl ||
                  "https://placehold.co/450x570?text=No+book+cover"
                }
                width={150}
                alt={book.title}
              />
              <p className="overflow-hidden truncate w-40">{book.title}</p>
              <p>By {book.authors.join(", ") || "unknown author"}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookList;
