import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookItem from "../components/BookItem";

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({ searchTerm: "" });

  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
      });
    }

    const fetchBooks = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/book/get-all-books`, {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      });
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setBooks(data);
      setLoading(false);
    };
    fetchBooks();
  }, [location.search]);

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7  border-b-2 md:border-r-2 md:min-h-screen"></div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Books results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && books.length === 0 && (
            <p className="text-xl text-slate-700">No listing found!</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p>
          )}

          {!loading &&
            books &&
            books.map((book) => <BookItem key={book.id} book={book} />)}
        </div>
      </div>
    </div>
  );
}
