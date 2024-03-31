import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import { SiBookstack } from "react-icons/si";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  SwiperCore.use([Navigation]);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);
  return (
    <div>
      {/* top */}
      <div className="flex-wrap md:flex h-screen justify-center">
        <div className="flex flex-3 flex-col gap-6 p-10 md:p-28 px-3 max-w-6xl mx-auto ">
          <h1 className="text-black-700 font-bold text-5xl lg:text-5xl">
            Books are the <span className="text-slate-500">knowledge</span>
            <br />
            to the next future.
            <br />
          </h1>
          <div className="text-gray-400 text-xs sm:text-sm">
            Share you books, with your network.
          </div>
          <Link to={"/search"}>
            <button className="text-white font-semibold py-3 px-6 bg-gradient-to-r from-blue-200 to-blue-400 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out flex items-center gap-3">
              <SiBookstack /> Show all books
            </button>
          </Link>
        </div>
        <div className="flex-2 flex justify-center items-center pr-2 md:pr-32">
          <img
            src="./books.png"
            alt=""
            className="h-[400px] w-[340px] items-center"
          />
        </div>
      </div>
    </div>
  );
}
