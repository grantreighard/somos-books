export interface IBook {
  _id: number;
  title: string;
  isbn: string;
  publishedDate: {
    $date: string;
  };
  thumbnailUrl: string;
  shortDescription: string;
  longDescription: string;
  authors: string[];
  categories: string[];
}

export type AppContextType = {
  books: IBook[];
  fetchBooks: () => void;
};
