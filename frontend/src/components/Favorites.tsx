import { Link } from "react-router-dom";
import BookList from "./BookList";

const Favorites = () => {
  return (
    <div>
      <h1 className="text-3xl">Favorites</h1>
      <Link to="/search">Search</Link>
      <BookList path="/favorites" />
    </div>
  );
};

export default Favorites;
