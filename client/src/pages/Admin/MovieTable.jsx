import { Button, message, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/loaderSlice";
import { getAllMovies } from "../../api/movie";
import { 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined, 
  LeftOutlined, 
  RightOutlined 
} from "@ant-design/icons";
import MovieForm from "./MovieForm";
import moment from "moment";
import DeleteMovieModal from "./DeleteMovieModal";

const MovieTable = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(showLoading());
      const response = await getAllMovies();
      if (response?.success === true) {
        setMovies(response?.data);
      } else {
        message.warning(response?.message);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // === CUSTOM CSS ===
  const customStyles = `
    /* Table Transparency */
    .ant-table, .ant-table-container, .ant-table-content { background: transparent !important; }
    
    /* Header Background & Border */
    .ant-table-thead > tr > th { 
      background: rgba(0,0,0,0.8) !important; 
      border-bottom: 1px solid rgba(255, 255, 255, 0.2) !important; 
    }

    /* Row Styles */
    .ant-table-tbody > tr > td { 
      border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
    }
    .ant-table-tbody > tr:hover > td { 
      background: rgba(255, 255, 255, 0.1) !important; 
    }

    /* === PAGINATION STYLING === */
    .ant-pagination {
      display: flex !important;
      justify-content: center !important; /* Centers pagination */
      align-items: center !important;
      margin-top: 20px !important;
    }

    /* Page Number Box */
    .ant-pagination-item { 
        background: transparent !important; 
        border: 1px solid rgba(255,255,255,0.4) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
    }
    .ant-pagination-item a { color: white !important; } 
    
    /* Active Page */
    .ant-pagination-item-active { 
        border-color: #ff0000 !important; 
    }
    .ant-pagination-item-active a { color: #ff0000 !important; }

    /* Prev/Next Buttons */
    .ant-pagination-prev, .ant-pagination-next {
       display: flex !important;
       align-items: center !important;
       justify-content: center !important;
    }
    .ant-pagination-prev .ant-pagination-item-link, 
    .ant-pagination-next .ant-pagination-item-link {
        color: white !important;
        background: transparent !important;
        border: 1px solid rgba(255,255,255,0.4) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
    }
    /* Disabled Arrow Color */
    .ant-pagination-disabled .ant-pagination-item-link {
        color: rgba(255,255,255,0.2) !important;
        border-color: rgba(255,255,255,0.1) !important;
    }
  `;

  const columns = [
    {
      key: "poster",
      title: <span style={{ color: "#ff0000" }}>Poster</span>, // Red
      dataIndex: "poster",
      render: (text) => (
        <img
          src={text}
          alt="Poster"
          style={{ objectFit: "cover", borderRadius: "4px", border: "1px solid #444" }}
          width="50"
          height="70"
        />
      ),
    },
    {
      key: "movieName",
      title: <span style={{ color: "#ffffff" }}>Movie Name</span>, // White
      dataIndex: "movieName",
      sorter: (a, b) => a.movieName.localeCompare(b.movieName),
      render: (text) => <span style={{ color: "white", fontWeight: "bold" }}>{text}</span>,
    },
    {
      key: "description",
      title: <span style={{ color: "#ff0000" }}>Description</span>, // Red
      dataIndex: "description",
      width: 300,
      render: (text) => (
        <div style={{ color: "white", maxHeight: "60px", overflow: "hidden", fontSize: "13px" }}>
          {text}
        </div>
      ),
    },
    {
      key: "duration",
      title: <span style={{ color: "#ffffff" }}>Duration</span>, // White
      dataIndex: "duration",
      render: (text) => <span style={{ color: "white" }}>{text} Mins</span>,
    },
    {
      key: "genre",
      title: <span style={{ color: "#ff0000" }}>Genre</span>, // Red
      dataIndex: "genre",
      render: (text) => <span style={{ color: "white" }}>{text}</span>,
    },
    {
      key: "language",
      title: <span style={{ color: "#ffffff" }}>Language</span>, // White
      dataIndex: "language",
      render: (text) => <span style={{ color: "white" }}>{text}</span>,
    },
    {
      key: "releaseDate",
      title: <span style={{ color: "#ff0000" }}>Release Date</span>, // Red
      dataIndex: "releaseDate",
      render: (text) => (
        <span style={{ color: "white" }}>
          {moment(text).format("MM-DD-YYYY")}
        </span>
      ),
    },
    {
      key: "Actions",
      title: <span style={{ color: "#ffffff" }}>Actions</span>, // White
      render: (text, data) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            onClick={() => {
              setIsModalOpen(true);
              setSelectedMovie({
                ...data,
                releaseDate: moment(data.releaseDate).format("YYYY-MM-DD"),
              });
            }}
            icon={<EditOutlined />}
            size="small"
            style={{
              backgroundColor: "transparent",
              borderColor: "white",
              color: "white",
            }}
          >
            Edit
          </Button>
          <Button
            danger
            type="primary"
            icon={<DeleteOutlined />}
            onClick={() => {
              setSelectedMovie(data);
              setIsDeleteModalOpen(true);
            }}
            size="small"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <style>{customStyles}</style>

      {/* Add Movie Button - Centered */}
      <div className="d-flex justify-content-center" style={{ marginBottom: "15px" }}>
        <Button
          onClick={() => {
            setIsModalOpen(true);
            setSelectedMovie(null);
          }}
          icon={<PlusOutlined />}
          style={{ 
            backgroundColor: "transparent", 
            border: "1px solid #ff0000", 
            color: "#ff0000", 
            fontWeight: "bold",
            padding: "0 30px" 
          }} 
        >
          Add Movie
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={movies}
        rowKey="_id"
        pagination={{ 
          pageSize: 8,
          itemRender: (current, type, originalElement) => {
             if (type === 'prev') {
                return <LeftOutlined style={{ color: 'white' }} />;
             }
             if (type === 'next') {
                return <RightOutlined style={{ color: 'white' }} />;
             }
             return originalElement;
          }
        }}
      />

      {isModalOpen && (
        <MovieForm
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          fetchMovieData={getData}
          selectedMovie={selectedMovie}
          setSelectedMovie={setSelectedMovie}
          closable={false} /* Added prop to remove 'X' from top */
        />
      )}
      {isDeleteModalOpen && (
        <DeleteMovieModal
          isDeleteModalOpen={isDeleteModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          selectedMovie={selectedMovie}
          setSelectedMovie={setSelectedMovie}
          fetchMovieData={getData}
          closable={false} /* Added prop to remove 'X' from top */
        />
      )}
    </>
  );
};

export default MovieTable;