import { Link } from "react-router-dom";
import BookList from "./BookList";

const Search = () => {
  return (
    <div>
      <h1 className="text-3xl">Search</h1>
      <Link to="/favorites">Favorites</Link>
      <BookList path="/search" />
    </div>
  );
};

export default Search;
