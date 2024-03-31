import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { BiBarcodeReader } from "react-icons/bi";
import { MdDateRange } from "react-icons/md";
import { CiPen } from "react-icons/ci";
import { IoCopy } from "react-icons/io5";
import photo from "../../public/books.png";
import { FaHeart } from "react-icons/fa6";

export default function Book() {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [addedFavorite, setAddedFavorite] = useState();
  const [errorAddedFavorite, errorSetAddedFavorite] = useState();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/book/${params.id}`, {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        });
        const data = await res.json();
        if (res.status != 200 && res.status != 201) {
          setError(true);
          setLoading(false);
          return;
        }
        setBook({
          ...data,
        });

        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchBooks();
  }, [params.id]);

  const handleFavorite = async () => {
    try {
      const res = await fetch(`/book/favorite/${params.id}`, {
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${currentUser.access_token}`,
        },
      });
      const data = await res.json();
      if (
        res.status != 200 &&
        res.status != 201 &&
        res.status != 203 &&
        res.status != 202
      ) {
        console.log(data);
        errorSetAddedFavorite(data.detail);
        return;
      }
      setAddedFavorite(true);
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      {book && !loading && !error && (
        <div>
          <img
            src={photo}
            className="h-[320px] sm:h-[220px] w-full object-cover sm:object-contain hover:scale-105 transition-scale duration-300"
          />

          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <div className="flex text-2xl font-semibold">{book.title}</div>
            <div
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            >
              <IoCopy className="text-slate-500 hover:text-gray-400" />
              <p className="hover:text-gray-600 text-gray-800 text-xs">
                Copy URL
              </p>
            </div>
            <div className="flex justify-end">
              {addedFavorite && (
                <p className="text-green-700 text-sm pr-5">
                  {" "}
                  Added to favorites!
                </p>
              )}
              {errorAddedFavorite && (
                <p className="text-red-600 text-sm pr-5">
                  {" "}
                  {errorAddedFavorite}
                </p>
              )}
              <FaHeart
                className="text-gray-400 hover:text-red-300"
                onClick={handleFavorite}
              />
            </div>
            <div className="justify-center items-center">
              <p className="flex items-center mt-1 gap-2 text-slate-600  text-sm">
                <BiBarcodeReader className="text-blue-400" />
                {book.isbn}
              </p>
              <p className="flex items-center mt-1 gap-2 text-slate-600  text-sm">
                <CiPen className="text-blue-400" />
                {book.author}
              </p>
              <p className="flex items-center mt-1 gap-2 text-slate-600  text-sm">
                <MdDateRange className="text-blue-400" />
                {book.publicationYear}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
