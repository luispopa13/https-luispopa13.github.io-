import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CommentsPage = () => {
  const { animeId } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!animeId) {
      setError("Invalid Anime ID");
      return;
    }

    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/comments/${animeId}`);
        setComments(response.data.comments || []);
      } catch (error) {
        setError("Failed to load comments. Please try again later.");
      }
    };

    fetchComments();
  }, [animeId]);

  const handlePostComment = async () => {
    if (!newComment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/comments", { animeId, comment: newComment });
      // Append the new comment and update the state
      setComments([...comments, { comment: newComment, timestamp: new Date() }]);
      setNewComment("");
    } catch (error) {
      setError("Failed to post comment.");
    }
  };

  return (
    <div className="container">
      <h3>Comments for Anime ID: {animeId}</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      {/* Scrollable container for comments */}
      <div style={{ maxHeight: "400px", overflowY: "auto", marginBottom: "10px" }}>
        <ul className="list-group">
          {comments.map((c, index) => (
            <li className="list-group-item" key={index}>
              {c.comment} - {new Date(c.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
      <textarea
        className="form-control"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Write a comment..."
      />
      <button className="btn btn-primary mt-2" onClick={handlePostComment}>
        Post Comment
      </button>
    </div>
  );
};

export default CommentsPage;
