import React, { useState, useEffect } from "react";
import axios from "axios";
import AnimeCard from "./AnimeCard"; // Adjust the path as needed

const SearchAnime = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to fetch anime data
  const fetchAnime = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]); // Clear results if input is empty
      onSearch(false); // Notify parent that search has ended
      return;
    }

    setLoading(true);
    setError("");
    onSearch(true); // Notify parent that search has started

    try {
      const response = await axios.get(`/api/scrape-anime?title=${encodeURIComponent(searchQuery)}`);
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch anime data.");
      setResults([]); // Clear results on error
    } finally {
      setLoading(false);
      onSearch(false); // Notify parent that search has ended
    }
  };

  // Trigger search whenever the input changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchAnime(query); // Fetch anime after user stops typing
    }, 500); // Debounce time (500ms)

    return () => clearTimeout(delayDebounce); // Cleanup the timeout
  }, [query]);

  return (
    <div>
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-danger">{error}</p>}
      <div className="row g-4 mt-4">
        {results.map((anime, index) => (
          <AnimeCard anime={anime} key={index} />
        ))}
      </div>
    </div>
  );
};

export default SearchAnime;
