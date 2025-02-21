import React, { useEffect, useState } from "react";
import axios from "axios";
import AnimeCard from "./AnimeCard"; // Adjust relative path if needed

const TrendingAndUpcoming = () => {
  const [trending, setTrending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use absolute URL with the correct port (3000) where your backend runs
        const { data } = await axios.get("http://localhost:3000/api/trending-upcoming");
        setTrending(data.trendingAnime || []);
        setUpcoming(data.upcomingAnime || []);
      } catch (err) {
        console.error("Error fetching trending/upcoming anime:", err);
        setError("Failed to fetch trending and upcoming anime.");
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {error && <p className="text-danger text-center">{error}</p>}
      <h2 className="text-center title">Trending Now</h2>
      {trending.length > 0 ? (
        <div className="row g-4 mt-4">
          {trending.map((anime, index) => (
            <AnimeCard anime={anime} key={index} />
          ))}
        </div>
      ) : (
        <p className="text-center">No trending anime found.</p>
      )}
      <h2 className="text-center title">Coming Soon</h2>
      {upcoming.length > 0 ? (
        <div className="row g-4 mt-4">
          {upcoming.map((anime, index) => (
            <AnimeCard anime={anime} key={index} />
          ))}
        </div>
      ) : (
        <p className="text-center">No upcoming anime found.</p>
      )}
    </div>
  );
};

export default TrendingAndUpcoming;
