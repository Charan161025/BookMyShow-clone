import { useEffect, useState } from "react";
import { message } from "antd"; 
import { useDispatch } from "react-redux";
import { getAllMovies } from "../api/movie";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const Home = () => {
  const dispatch = useDispatch();
  const [movies, setMovies] = useState([]);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const getData = async () => {
    try {
      dispatch(showLoading());
      const response = await getAllMovies();
      if (response.success) {
        setMovies(response.data);
      } else {
        message.warning(response.message);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div style={{ width: "100%", padding: "20px", boxSizing: "border-box" }}>
      
      
      <style>
        {`
          .my-search-input {
            background-color: transparent !important;
            border: none !important;
            box-shadow: none !important;
            outline: none !important;
            color: white !important;
            font-size: 16px !important;
            width: 100% !important;
            height: 100% !important;
          }
          .my-search-input::placeholder {
            color: rgba(255, 255, 255, 0.5) !important;
          }
        `}
      </style>

     
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px', width: "100%" }}>
        <div 
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            maxWidth: "600px",
            height: "50px",
            backgroundColor: "#374151",
            border: "1px solid #555",
            borderRadius: "8px",
            padding: "0 15px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
          }}
        >
          <SearchOutlined 
            style={{ 
              color: "#ff4d4f", 
              fontSize: "20px", 
              marginRight: "10px",
              background: "transparent"
            }} 
          />
          <input
            type="text"
            className="my-search-input"
            placeholder="Type here to search for movie"
            onChange={handleSearch}
            value={searchText}
          />
        </div>
      </div>

      
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", 
          gap: "25px",
          width: "100%",
        }}
      >
        {movies &&
          movies
            .filter((movie) =>
              movie?.movieName?.toLowerCase().includes(searchText.toLowerCase())
            )
            .map((movie) => {
              return (
                <div
                  key={movie._id}
                  style={{ cursor: "pointer", textAlign: "center" }}
                  onClick={() => {
                    navigate(`/movie/${movie._id}?date=${moment().format("YYYY-MM-DD")}`);
                  }}
                >
                  
                  <div style={{ width: "100%", position: "relative" }}>
                    <img
                      src={movie?.poster}
                      alt={movie.movieName}
                      style={{
                        width: "100%",
                        aspectRatio: "2 / 3", 
                        height: "auto", 
                        borderRadius: "8px",
                        objectFit: "cover", 
                        boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
                        border: "1px solid #444",
                      }}
                    />
                  </div>
                  
                  <h3 style={{ marginTop: "12px", fontSize: "16px", fontWeight: "600", color: "white" }}>
                    {movie.movieName}
                  </h3>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default Home;