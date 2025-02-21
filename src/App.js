import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AnimeCard from "./components/AnimeCard";
import TrendingAndUpcoming from "./components/TrendingAndUpcoming";
import CommentsPage from "./components/CommentsPage";
import axios from "axios";
import "./styles/AnimeCard.css";
import "./styles/styles.css";

const App = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await axios.get(
          `http://localhost:3000/api/scrape-anime?title=${encodeURIComponent(query)}`
        );
        setResults(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch anime data.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchResults, 500);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <>
      <Navbar onSearch={setQuery} />
      <div className="container my-4">
        <Routes>
          <Route
            path="/"
            element={
              <>
                {loading && <p className="text-center">Loading...</p>}
                {error && <p className="text-center text-danger">{error}</p>}
                {results.length > 0 ? (
                  <div className="row g-4">
                    {results.map((anime, index) => (
                      <AnimeCard anime={anime} key={index} />
                    ))}
                  </div>
                ) : (
                  !loading && !error && <TrendingAndUpcoming />
                )}
              </>
            }
          />
          <Route path="/comments/:animeId" element={<CommentsPage />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
