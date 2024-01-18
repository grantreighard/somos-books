import { Link } from "react-router-dom";
import BookList from "./BookList";
import Header from "./Header";

const Favorites = () => {
  return (
    <div>
      <Header />
      <h1 className="text-3xl">Favorites</h1>
      <BookList />
    </div>
  );
};

export default Favorites;
