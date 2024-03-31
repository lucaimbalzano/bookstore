import { FaHome, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import home from "../assets/logo-intellico.png";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 640);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 640);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header className="bg-indigo-100">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          {isSmallScreen ? (
            <img width={130} height={55} src={home} alt="houseav" />
          ) : (
            <div className="flex items-center gap-6">
              <img width={130} height={55} src={home} alt="houseav" />
              <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
                <span className="text-black-500 hover:text-gray-400">BOOK</span>
                <span className="text-slate-400 ">STORE</span>
              </h1>
            </div>
          )}
        </Link>

        <ul className="flex gap-4 justify-center items-center">
          <Link to="/">
            <FaHome className="hover:opacity-65" />
          </Link>

          <Link to="/profile">
            {currentUser ? (
              <FaUser className="hover:opacity-65" />
            ) : (
              <li className="sm:inline text-black hover:text-slate-800">
                Sign in
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
