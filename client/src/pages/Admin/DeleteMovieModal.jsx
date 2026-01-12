import { message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/loaderSlice";
import { deleteMovie } from "../../api/movie";

const DeleteMovieModal = ({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  selectedMovie,
  setSelectedMovie,
  fetchMovieData,
}) => {
  const dispatch = useDispatch();

  const handleOk = async () => {
    try {
      dispatch(showLoading());
      const movieId = selectedMovie._id;
      const response = await deleteMovie(movieId);
      if (response.success) {
        message.success(response.message);
      } else {
        message.warning(response.message);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedMovie(null);
      fetchMovieData();
      dispatch(hideLoading());
    }
  };

  const handleCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedMovie(null);
  };

  if (!isDeleteModalOpen) return null;

  return (
    <>
      <div className="modal-overlay">
        <div className="delete-modal-content">
          <div className="modal-header">
            <h2 className="modal-title">Delete Movie</h2>
          </div>

          <div className="modal-body">
            <p className="warning-text">
              Are you sure you want to delete this movie?
              <br />
              <span className="movie-name-highlight">
                {selectedMovie?.movieName}
              </span>
            </p>
            <p className="sub-text">
              This action can't be undone and you'll lose this movie data.
            </p>
          </div>

          <div className="modal-footer">
            <button className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
            <button className="btn-delete" onClick={handleOk}>
              Delete
            </button>
          </div>
        </div>
      </div>

      <style>{`
        /* 1. Overlay */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }

        /* 2. Glass Modal Box */
        .delete-modal-content {
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(15px);
          padding: 25px;
          border-radius: 8px;
          border: 1px solid #444;
          width: 500px;
          max-width: 90%;
          color: white;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        /* 3. Header */
        .modal-header {
          display: flex;
          justify-content: center; /* Centered the title since button is gone */
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 10px;
        }
        .modal-title {
          margin: 0;
          font-size: 1.2rem;
          color: #ff4d4f; /* Red Title */
        }

        /* 4. Body Text */
        .modal-body {
          margin-bottom: 25px;
        }
        .warning-text {
          font-size: 1.1rem;
          color: white;
          margin-bottom: 10px;
        }
        .movie-name-highlight {
          color: #ff4d4f; /* Red Highlight for Movie Name */
          font-weight: bold;
          font-size: 1.3rem;
          display: block;
          margin-top: 10px;
        }
        .sub-text {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.6);
        }

        /* 5. Footer Buttons */
        .modal-footer {
          display: flex;
          justify-content: center; /* Centered buttons */
          gap: 15px;
        }
        .btn-cancel {
          background: transparent;
          border: 1px solid white;
          color: white;
          padding: 8px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          transition: 0.3s;
        }
        .btn-cancel:hover {
          background: rgba(255,255,255,0.1);
        }
        
        .btn-delete {
          background-color: #e50914; /* Red Background */
          border: none;
          color: white;
          padding: 8px 25px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          transition: 0.3s;
        }
        .btn-delete:hover {
          background-color: #ff1f1f;
        }
      `}</style>
    </>
  );
};

export default DeleteMovieModal;