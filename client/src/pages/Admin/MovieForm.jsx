import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/loaderSlice";
import { addMovie, updateMovie } from "../../api/movie";
import { message } from "antd";

const MovieForm = ({
  isModalOpen,
  setIsModalOpen,
  fetchMovieData,
  selectedMovie,
  setSelectedMovie,
}) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    movieName: "",
    description: "",
    duration: "",
    language: "",
    releaseDate: "",
    genre: "",
    poster: "",
  });

  // Calculate Today's Date in YYYY-MM-DD format for validation
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (selectedMovie) {
      const formattedDate = selectedMovie.releaseDate
        ? new Date(selectedMovie.releaseDate).toISOString().split("T")[0]
        : "";

      setFormData({
        movieName: selectedMovie.movieName || "",
        description: selectedMovie.description || "",
        duration: selectedMovie.duration || "",
        language: selectedMovie.language || "",
        releaseDate: formattedDate,
        genre: selectedMovie.genre || "",
        poster: selectedMovie.poster || "",
      });
    } else {
      setFormData({
        movieName: "",
        description: "",
        duration: "",
        language: "",
        releaseDate: "",
        genre: "",
        poster: "",
      });
    }
  }, [selectedMovie, isModalOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- DATE VALIDATION CHECK ---
    if (formData.releaseDate && formData.releaseDate < today) {
      message.warning("Please enter a valid date (Today or Future only)!");
      return;
    }

    try {
      dispatch(showLoading());
      let response;
      if (selectedMovie) {
        response = await updateMovie({ ...formData, movieId: selectedMovie._id });
      } else {
        response = await addMovie(formData);
      }
      if (response?.success === true) {
        message.success(response?.message);
        handleCancel();
      } else {
        message.warning(response?.message);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(hideLoading());
      fetchMovieData();
    }
  };

  if (!isModalOpen) return null;

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            {/* 1. X Button Removed. Title Centered. */}
            <h2 className="modal-title">{selectedMovie ? "Edit Movie" : "Add Movie"}</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Movie Name</label>
              <input
                type="text"
                name="movieName"
                value={formData.movieName}
                onChange={handleChange}
                placeholder="Enter movie name"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                rows="3"
                required
              />
            </div>

            <div className="row-three">
              <div className="form-group">
                <label>Movie Duration (min)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Duration"
                  required
                />
              </div>

              <div className="form-group">
                <label>Language</label>
                <select 
                  name="language" 
                  value={formData.language} 
                  onChange={handleChange} 
                  required
                  style={{ color: formData.language ? "white" : "rgba(255, 255, 255, 0.3)" }}
                >
                  <option value="" disabled>Select Language</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Punjabi">Punjabi</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Bengali">Bengali</option>
                  <option value="German">German</option>
                </select>
              </div>

              <div className="form-group">
                <label>Release Date</label>
                <input
                  type="date"
                  name="releaseDate"
                  value={formData.releaseDate}
                  onChange={handleChange}
                  required
                  min={today}
                  style={{ color: formData.releaseDate ? "white" : "rgba(255, 255, 255, 0.3)" }}
                />
              </div>
            </div>

            <div className="row-two">
              <div className="form-group genre-group">
                <label>Genre</label>
                <select 
                  name="genre" 
                  value={formData.genre} 
                  onChange={handleChange} 
                  required
                  style={{ color: formData.genre ? "white" : "rgba(255, 255, 255, 0.3)" }}
                >
                  <option value="" disabled>Select Genre</option>
                  <option value="Action">Action</option>
                  <option value="Comedy">Comedy</option>
                  <option value="Horror">Horror</option>
                  <option value="Love">Love</option>
                  <option value="Patriot">Patriot</option>
                  <option value="Bhakti">Bhakti</option>
                  <option value="Thriller">Thriller</option>
                  <option value="Mystery">Mystery</option>
                </select>
              </div>

              <div className="form-group poster-group">
                <label>Poster URL</label>
                <input
                  type="text"
                  name="poster"
                  value={formData.poster}
                  onChange={handleChange}
                  placeholder="Poster URL"
                  required
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={handleCancel}>Cancel</button>
              <button type="submit" className="btn-submit">Submit</button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        /* 1. Modal Overlay */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        /* 2. Glass Modal Box */
        .modal-content {
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(15px);
          padding: 30px;
          border-radius: 8px;
          border: 1px solid #444;
          width: 800px;
          max-width: 90%;
          color: white;
        }

        /* 3. Header */
        .modal-header {
          display: flex;
          justify-content: center; /* Center the title since X is gone */
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 10px;
        }
        .modal-title {
          margin: 0;
          font-size: 1.5rem;
          color: white;
          font-weight: 600;
          /* Ensure Title matches the font */
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        /* 4. Form Layout */
        .form-group {
          margin-bottom: 15px;
          display: flex;
          flex-direction: column;
        }
        .row-three {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 15px;
          margin-bottom: 15px;
        }
        .row-two {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 15px;
          margin-bottom: 20px;
        }

        /* 5. ALL LABELS RED */
        label {
          color: #ff4d4f; /* Bright Red */
          margin-bottom: 5px;
          font-size: 0.9rem;
          font-weight: 500;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        /* 6. Inputs / Selects / Textarea - FIXING FONT HERE */
        input, textarea, select {
          background-color: transparent !important;
          border: 1px solid rgba(255, 255, 255, 0.3) !important;
          border-radius: 4px;
          padding: 10px;
          color: white; 
          font-size: 1rem;
          width: 100%;
          box-sizing: border-box;
          outline: none;
          
          /* IMPORTANT: Force same font for Description & Date as other inputs */
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
        }

        input:focus, textarea:focus, select:focus {
          border-color: #e50914 !important;
        }
        ::placeholder {
          color: rgba(255, 255, 255, 0.3);
          font-family: inherit; /* Matches the input font */
        }

        /* 7. DATE PICKER - White Calendar Icon */
        input[type="date"]::-webkit-calendar-picker-indicator {
            filter: invert(1);
            cursor: pointer;
        }
        
        /* 8. Dropdown Options */
        select option {
          background-color: #222;
          color: white;
        }

        /* 9. Buttons */
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        .btn-cancel {
          background: transparent;
          border: 1px solid white;
          color: white;
          padding: 8px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          font-family: inherit;
        }
        .btn-cancel:hover {
          background: rgba(255,255,255,0.1);
        }
        .btn-submit {
          background: #e50914;
          border: none;
          color: white;
          padding: 8px 25px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          font-family: inherit;
        }
        .btn-submit:hover {
          background: #ff1f1f;
        }
      `}</style>
    </>
  );
};

export default MovieForm;