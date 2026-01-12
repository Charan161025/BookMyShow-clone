import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { message, DatePicker } from "antd"; 
import { getMovieById } from "../api/movie";
import { EnvironmentOutlined } from "@ant-design/icons";
import { getAllTheatresByMovie } from "../api/show";
import dayjs from "dayjs";

const SingleMovie = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const [queryParam] = useSearchParams();
  const navigate = useNavigate();

  
  const [date, setDate] = useState(
    queryParam.get("date") || dayjs().format("YYYY-MM-DD")
  );
  const [movie, setMovie] = useState(null);
  const [theatres, setTheatres] = useState([]);

  const getData = async () => {
    try {
      dispatch(showLoading());
      const response = await getMovieById(params?.id);
      if (response.success) {
        setMovie(response.data);
      } else {
        message.warning(response.message);
      }
    } catch (error) {
      message.error("Failed to fetch movie details");
    } finally {
      dispatch(hideLoading());
    }
  };

  const getAllTheatres = async () => {
    try {
      dispatch(showLoading());
      const response = await getAllTheatresByMovie({ movie: params.id, date });
      if (response.success) {
        setTheatres(response.data);
      } else {
        setTheatres([]);
      }
    } catch (error) {
      message.error("Failed to fetch theatres");
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    if (params.id) getData();
  }, [params.id]);

  useEffect(() => {
    if (params.id && date) getAllTheatres();
  }, [params.id, date]);

  const handleDateChange = (dateValue, dateString) => {
    
    
    const formattedDate = dateValue ? dateValue.format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD");
    setDate(formattedDate);
    navigate(`/movie/${params.id}?date=${formattedDate}`);
  };

  return (
    <div className="movie-page-transparent">
      <div className="main-content">
        {movie && (
          <div className="hero-container">
            <img src={movie?.poster} alt="poster" className="external-poster" />
            
            <div className="movie-details-content">
              <h1 className="movie-title-styled">{movie.movieName}</h1>
              
              <div className="vertical-specs">
                <p><span>Language:</span> {movie.language}</p>
                <p><span>Genre:</span> {movie.genre}</p>
                <p><span>Duration:</span> {movie.duration} Mins</p>
                
                <div className="date-picker-section">
                  <label className="picker-label">Select Date</label>
                  <DatePicker 
                    onChange={handleDateChange} 
                    value={dayjs(date)} 
                    format="DD-MM-YYYY" 
                    className="custom-antd-picker"
                    allowClear={false}
                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="theatres-section">
          <h2 className="section-title">Available Theatres</h2>
          
          {theatres.length > 0 ? (
            theatres.map((theatre) => (
              <div key={theatre._id} className="theatre-card-transparent">
                <div className="theatre-meta">
                  <h3 className="theatre-name">{theatre.name}</h3>
                  <p className="theatre-address"><EnvironmentOutlined /> {theatre.address}</p>
                </div>
                
                <div className="timings-list">
                  {theatre.shows.map((show) => (
                    <div
                      key={show._id}
                      className="time-pill-rounded"
                      onClick={() => navigate(`/book-show/${show._id}`)}
                    >
                      {dayjs(show.time, "HH:mm").format("hh:mm A")}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="no-theatres">No shows available for the selected date.</p>
          )}
        </div>
      </div>

      <style>{`
        .movie-page-transparent {
          min-height: 100vh;
          background: transparent;
          padding: 40px 8%;
        }

        .hero-container {
          display: flex;
          gap: 50px;
          align-items: center;
          margin-bottom: 50px;
        }

        .external-poster {
          width: 220px;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.7);
        }

        .movie-details-content { flex: 1; }

        .movie-title-styled {
          font-size: 3.8rem;
          margin: 0 0 10px 0;
          color: #fff;
          font-weight: 800;
          text-shadow: 2px 2px 10px rgba(0,0,0,0.5);
        }

        .vertical-specs {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .vertical-specs p { margin: 0; color: #fff; font-size: 1.15rem; }
        .vertical-specs span { color: #ff4d4f; font-weight: 600; margin-right: 8px; }

        .date-picker-section {
          margin-top: 25px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .picker-label {
          color: #ff4d4f;
          font-weight: 600;
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* Date Picker White Box Styling */
        .custom-antd-picker {
          background: #ffffff !important; 
          border: 1px solid #d9d9d9 !important;
          border-radius: 6px !important;
          padding: 8px 12px !important;
          width: fit-content;
        }

        .custom-antd-picker .ant-picker-input > input {
          color: #000000 !important; /* Black text for visibility in white box */
          font-weight: 500;
        }

        .custom-antd-picker .ant-picker-suffix {
          color: #ff4d4f !important; /* Red calendar icon */
        }

        .theatres-section { margin-top: 40px; }
        .section-title { color: #fff; margin-bottom: 25px; font-weight: 600; font-size: 1.6rem; }

        .theatre-card-transparent {
          display: flex;
          align-items: center;
          gap: 40px;
          padding: 25px;
          margin-bottom: 15px;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(12px);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .theatre-meta { min-width: 250px; }
        .theatre-name { color: #ff4d4f; margin: 0; font-size: 1.25rem; font-weight: 600; }
        .theatre-address { color: #999; font-size: 0.9rem; margin-top: 5px; }

        .timings-list { display: flex; gap: 12px; flex-wrap: wrap; flex: 1; }

        /* Timing Pills - White by default */
        .time-pill-rounded {
          padding: 8px 22px;
          border: 1px solid #ffffff; 
          color: #ffffff;
          cursor: pointer;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.3s ease;
          background: transparent;
        }

        /* Timing Pills - Red on Hover */
        .time-pill-rounded:hover {
          background: #ff4d4f;
          border-color: #ff4d4f;
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(255, 77, 79, 0.3);
        }

        .no-theatres {
          color: #888;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default SingleMovie;