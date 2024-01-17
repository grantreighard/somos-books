import { useContext } from "react";
import { AppContext } from "../contexts/appContext";
import { AppContextType } from "../@types/context";

const Search = () => {
    const { books } = useContext(AppContext) as AppContextType;
    return (
        <div>Search {books?.length}</div>
    )
}

export default Search;