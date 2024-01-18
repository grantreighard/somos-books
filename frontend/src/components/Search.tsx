import { Link } from "react-router-dom";
import BookList from "./BookList";
import Header from "./Header";

const Search = () => {
  return (
    <div>
      <Header />
      <h1 className="text-3xl">Search</h1>
      <BookList />
    </div>
  );
};

export default Search;
