import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AnimeCard.css";

const AnimeCard = ({ anime }) => {
  const navigate = useNavigate();

  if (!anime) {
    return <div className="text-danger">Anime data is unavailable</div>;
  }

  const handleLeaveComment = () => navigate(`/comments/${anime.id}`);
  const handleWatchAnime = () => {
    // Open the watchLink in a new tab
    window.open(anime.watchLink, "_blank");
  };

  return (
    <div className="col-md-6 col-lg-4 d-flex justify-content-center">
      <div className="card anime-card shadow-sm">
        <div className="image-container">
          <img
            src={anime.image || "/path/to/fallback-image.jpg"}
            alt={anime.title || "Unknown Anime"}
            className="anime-image"
          />
        </div>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{anime.title || "Untitled Anime"}</h5>
          <p className="text-muted">
            {anime.description || "No description available."}
          </p>
          <div className="d-flex justify-content-between mt-2">
            <button className="btn btn-primary" onClick={handleLeaveComment}>
              Leave Comment
            </button>
            <button className="btn btn-secondary" onClick={handleWatchAnime}>
              Watch Anime
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;
