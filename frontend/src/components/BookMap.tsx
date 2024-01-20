import { useContext } from "react";
import { IBookMapProps } from "../@types/bookMap";
import { IBook, AppContextType } from "../@types/context";
import { AppContext } from "../contexts/appContext";

const BookMap: React.FC<IBookMapProps> = ({ books }) => {
  const { favoritesList, toggleFavoriteById } = useContext(
    AppContext
  ) as AppContextType;

  return (
    <div className="flex flex-wrap justify-center">
      {books.map((book: IBook) => {
        return (
          <div
            className="w-[200px] h-[350px] flex flex-col m-4 overflow-hidden relative"
            key={book?._id}
          >
            <img
              src={
                book.thumbnailUrl ||
                "https://placehold.co/450x570?text=No+book+cover"
              }
              width={190}
              alt={book.title}
              className="border-black dark:border-white border-[1px]"
            />
            <p title={book.title}>
              <span className="text-cyan-600 dark:text-cyan-300">
                {book.title}
              </span>
              <span>
                {" "}
                by{" "}
                {book.authors
                  .filter((a) => !!a)
                  .slice(0, 2)
                  .join(" and ") +
                  (book.authors.length > 2 ? ", et al." : "") ||
                  "unknown author"}
              </span>
            </p>

            <button
              onClick={() => toggleFavoriteById(book._id)}
              title={
                favoritesList?.includes(book?._id) ? "Unfavorite" : "Favorite"
              }
              className={
                "absolute top-[0px] right-[10px] bg-indigo-400 rounded-bl-full w-[30px] h-[30px] pl-2 pb-2" +
                (!favoritesList?.includes(book?._id) ? " filter grayscale" : "")
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
