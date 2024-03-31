import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import {
  deleteUserFailure,
  signOutUserFailure,
  signOutUserSuccess,
  signOutUserStart,
  signInFailure,
  signInSuccess,
} from "../redux/user/userSlice";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showListingsError, setShowListingsError] = useState(false);
  const [userBooks, setUserBooks] = useState();
  const [userBooksFavorite, setUserBooksFavorite] = useState([]);
  const [formDataUserUpdate, setFormDataUserUpdate] = useState({});
  const [fetchUserLoop, setFetchUserLoop] = useState(true);
  const [showNoBooks, setShowNoBooks] = useState();
  const [showFavorite, setShowFavorite] = useState();

  const handleChangeInput = (event) => {
    setFormDataUserUpdate({
      ...formDataUserUpdate,
      [event.target.id]: event.target.value,
    });
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/users/invalidate-token", {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${currentUser.access_token}`,
        },
      });
      const data = await res.json();
      if (res.status != 200 && res.status != 201) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowBooks = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/book/books`, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${currentUser.access_token}`,
        },
      });
      const data = await res.json();
      if (data.length === 0) {
        setShowNoBooks(true);
      } else {
        setShowNoBooks(false);
      }

      if (res.status != 200 && res.status != 201) {
        setShowListingsError(true);
        return;
      }
      setUserBooks(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleShowFavorites = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/book/get/favorite-books`, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${currentUser.access_token}`,
        },
      });
      const data = await res.json();
      if (data.length === 0) {
        setShowFavorite(true);
      } else {
        setShowFavorite(false);
      }

      if (![200, 201, 202, 203].includes(res.status)) {
        setShowListingsError(true);
        return;
      }
      for (const { user_id, book_id } of data) {
        await getFavoriteBooK(user_id, book_id);
      }
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const getFavoriteBooK = async (user_id, book_id) => {
    const res = await fetch(`/book/${book_id}`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${currentUser.access_token}`,
      },
    });
    const data = await res.json();
    if (![200, 201, 202, 203].includes(res.status)) {
      return;
    }
    setUserBooksFavorite((prevData) => [...prevData, data]);
  };

  const handleBookDelete = async (id) => {
    try {
      const res = await fetch(`/book/delete/${id}`, {
        method: "DELETE",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${currentUser.access_token}`,
        },
      });
      const data = await res.json();
      if (![200, 201, 202, 203].includes(res.status)) {
        console.log(data.message);
        return;
      }
      setUserBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleBookDeleteFavorite = async (book_id) => {
    try {
      const res = await fetch(`/book/delete-favorite/${book_id}`, {
        method: "DELETE",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${currentUser.access_token}`,
        },
      });
      const data = await res.json();
      if (![200, 201, 202, 203].includes(res.status)) {
        console.log(data.message);
        return;
      }
      setUserBooksFavorite((prev) =>
        prev.filter((book) => book.id !== book_id)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const refreshTokenUser = async () => {
    const refresh_token = currentUser.refresh_token;
    try {
      const res = await fetch(`/auth/refresh`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "refresh-token": `${refresh_token}`,
        },
      });
      const data = await res.json();
      if (res.status == 200 || res.status == 201) {
        dispatch(signInSuccess(data));
        setFetchUserLoop(false);
        fetchUser();
      } else {
        dispatch(signInFailure(data.detail, false));
        navigate("/sign-in");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUser = async () => {
    const access_token = currentUser.access_token;
    try {
      const res = await fetch(`/users/me`, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      });
      const data = await res.json();
      if (res.status == 401 && fetchUserLoop) {
        var dataRefreshToken = await refreshTokenUser();
      }
      if (res.status != 200 && res.status != 201) {
        dispatch(signInFailure(data.detail, false));
        navigate("/sign-in");
      } else {
        setFormDataUserUpdate({
          ...formDataUserUpdate,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          registered_at: data.registered_at,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="first name"
          defaultValue={formDataUserUpdate.first_name}
          id="first_name"
          className="p-3 rounded-lg bg-[rgb(241,245,241)]"
          onChange={handleChangeInput}
        />
        <input
          type="text"
          placeholder="last name"
          defaultValue={formDataUserUpdate.last_name}
          id="last_name"
          className="p-3 rounded-lg bg-[rgb(241,245,241)]"
          onChange={handleChangeInput}
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          defaultValue={formDataUserUpdate.email}
          className="p-3 rounded-lg bg-[rgb(241,245,241)]"
          onChange={handleChangeInput}
        />

        <Link
          className="w-full text-center mt-4 justify-center text-white font-semibold py-3 px-6 bg-gradient-to-r from-blue-200 to-blue-400 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out flex items-center gap-3"
          to={"/create-book"}
        >
          Create Book
        </Link>
      </form>
      <div>
        <button
          onClick={handleShowBooks}
          className="w-full text-center mt-4 justify-center text-white font-semibold py-3 px-6 bg-gradient-to-r from-blue-200 to-blue-400 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out flex items-center gap-3"
        >
          Show my books
        </button>
      </div>
      <div>
        <button
          onClick={handleShowFavorites}
          className="w-full text-center mt-4 justify-center text-white font-semibold py-3 px-6 bg-gradient-to-r from-blue-200 to-blue-400 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out flex items-center gap-3"
        >
          Show Favorites
        </button>
      </div>
      <div className="flex justify-between mt-5">
        <span
          className="flex justify-center items-center gap-2 text-blue-500 cursor-pointer"
          onClick={handleSignOut}
        >
          <FaSignOutAlt /> Sign out
        </span>
      </div>
      <div className="flex justify-center mt-5">
        <p className="text-red-700 mt-5">{error ? error : ""}</p>
      </div>
      <div className="flex justify-center gap-3 ">
        <p className="text-red-700 mt-5">
          {showListingsError ? "Error showing data" : ""}
          {showNoBooks == true && "No Books created for this user"}
          {showFavorite == true && "No Favorite books for this user"}
        </p>
        {userBooksFavorite && userBooksFavorite.length > 0 && (
          <div className="flex flex-col gap-4">
            <h1 className="text-center mt-7 text-2xl font-semibold">
              Your Favorites Book
            </h1>
            {userBooksFavorite.map((book) => (
              <div
                key={`${book.id}${book.isbn}`}
                className="border rounded-lg p-3 flex justify-between items-center gap-4"
              >
                <Link to={`/get-book/${book.id}`}>
                  <img
                    src="./books.png"
                    alt="book cover"
                    className="h-16 w-16 object-contain"
                  />
                </Link>
                <Link
                  className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                  to={`/get-book/${book.id}`}
                >
                  <p>{book.title}</p>
                </Link>

                <div className="flex flex-col item-center">
                  <button
                    onClick={() => handleBookDeleteFavorite(book.id)}
                    className="text-red-700 uppercase"
                  >
                    <TiDelete className="text-red-500 text-3xl hover:shadow-sm hover:opacity-65" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {userBooks && userBooks.length > 0 && (
          <div className="flex flex-col gap-4">
            <h1 className="text-center mt-7 text-2xl font-semibold">
              Your Listing Books
            </h1>
            {userBooks.map((book) => (
              <div
                key={`${book.id}${book.title}`}
                className="border rounded-lg p-3 flex justify-between items-center gap-4"
              >
                <Link to={`/get-book/${book.id}`}>
                  <img
                    src="./books.png"
                    alt="book cover"
                    className="h-16 w-16 object-contain"
                  />
                </Link>
                <Link
                  className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                  to={`/get-book/${book.id}`}
                >
                  <p>{book.title}</p>
                </Link>

                <div className="flex flex-col item-center">
                  <button
                    onClick={() => handleBookDelete(book.id)}
                    className="text-red-700 uppercase"
                  >
                    Delete
                  </button>
                  <Link to={`/update-book/${book.id}`}>
                    <button className="text-green-700 uppercase">Edit</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
