import { useContext } from "react";
import { IBookMapProps } from "../@types/bookMap";
import { IBook, AppContextType } from "../@types/context";
import { AppContext } from "../contexts/appContext";

const BookMap: React.FC<IBookMapProps> = ({ books }) => {
  const { favoritesList, toggleFavoriteById } = useContext(
    AppContext
  ) as AppContextType;

  return (
    <div className="flex flex-wrap">
      {books.map((book: IBook) => {
        return (
          <div className="w-[200px] h-[350px] flex flex-col m-4 overflow-hidden relative">
            <img
              src={
                book.thumbnailUrl ||
                "https://placehold.co/450x570?text=No+book+cover"
              }
              width={190}
              alt={book.title}
            />
            <p className="overflow-hidden truncate w-40" title={book.title}>
              {book.title}
            </p>
            <p>
              By{" "}
              {book.authors
                .filter((a) => !!a)
                .slice(0, 3)
                .join(", ") || "unknown author"}
            </p>
            <button
              onClick={() => toggleFavoriteById(book._id)}
              title={
                favoritesList.includes(book?._id) ? "Unfavorite" : "Favorite"
              }
              className={
                "absolute top-[0px] right-[10px] bg-gray-300 rounded-full w-[30px] h-[30px]" + 
                (!favoritesList.includes(book?._id)
                 ? " filter grayscale" : "")
              }
            >
              ⭐️
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default BookMap;
