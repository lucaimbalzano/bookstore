import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function UpdateBook() {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const params = useParams();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/book/${params.id}`, {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${currentUser.access_token}`,
          },
        });
        const data = await res.json();
        if (res.status != 200 && res.status != 201) {
          setError(true);
          setLoading(false);
          return;
        }
        setFormData({
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

  const handleChange = (event) => {
    if (event.target.type === "text")
      setFormData({
        ...formData,
        [event.target.id]: event.target.value,
      });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const res = await fetch(`/book/update/${params.id}`, {
        method: "PUT",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.access_token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      if (res.status == 401) {
        setError(data.detail);
        navigate("/sign-in");
      }
      if (res.status != 200 && res.status != 201) {
        setError(data.detail);
      }
      navigate(`/get-book/${params.id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="title"
            className="border p-3 rounded-lg"
            id="title"
            required
            onChange={handleChange}
            value={formData.title}
          />
          <input
            type="text"
            placeholder="author"
            className="border p-3 rounded-lg"
            id="author"
            required
            onChange={handleChange}
            value={formData.author}
          />
          <input
            type="text"
            placeholder="isbn"
            className="border p-3 rounded-lg"
            id="isbn"
            required
            onChange={handleChange}
            value={formData.isbn}
          />
          <input
            type="text"
            placeholder="publication year"
            className="border p-3 rounded-lg"
            id="publicationYear"
            required
            onChange={handleChange}
            value={formData.publicationYear}
          />
          <button
            disabled={loading}
            className="w-full text-center mt-4 justify-center text-white font-semibold py-3 px-6 bg-gradient-to-r from-blue-200 to-blue-400 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out flex items-center gap-3"
          >
            {loading ? "Creating..." : "Update Book"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
