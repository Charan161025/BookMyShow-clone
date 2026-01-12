import { Button, message, Table } from "antd";
import  { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAlltheatresByOwner } from "../../api/theatre";
import { hideLoading, showLoading } from "../../redux/loaderSlice";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import TheatreForm from "./TheatreForm";
import DeleteTheatreModal from "./DeleteTheatreModal";
import ShowModal from "./ShowModal";

const TheatreList = () => {
  const [theatres, setTheatres] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(showLoading());
      const response = await getAlltheatresByOwner();
      if (response?.success === true) {
        setTheatres(response?.data);
      } else {
        message.warning(response?.message);
      }
    } catch (error) {
      message.error(error);
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      key: "name",
      title: <span style={{ color: "red", fontWeight: "bold" }}>Name</span>,
      dataIndex: "name",
      render: (text) => <span style={{ color: "white" }}>{text}</span>,
    },
    {
      key: "address",
      title: <span style={{ color: "white", fontWeight: "bold" }}>Address</span>,
      dataIndex: "address",
      render: (text) => <span style={{ color: "white" }}>{text}</span>,
    },
    {
      key: "phone",
      title: <span style={{ color: "red", fontWeight: "bold" }}>Phone Number</span>,
      dataIndex: "phone",
      render: (text) => <span style={{ color: "white" }}>{text}</span>,
    },
    {
      key: "email",
      title: <span style={{ color: "white", fontWeight: "bold" }}>Email</span>,
      dataIndex: "email",
      render: (text) => <span style={{ color: "white" }}>{text}</span>,
    },
    {
      key: "status",
      title: <span style={{ color: "red", fontWeight: "bold" }}>Status</span>,
      dataIndex: "isActive",
      render: (text, data) => {
        const statusText = data.isActive ? "Approved/Running" : "Pending/Blocked/UnderMaintenance";
        return <span style={{ color: "white" }}>{statusText}</span>;
      },
    },
    {
      key: "Actions",
      title: <span style={{ color: "white", fontWeight: "bold" }}>Actions</span>,
      render: (text, data) => {
        return (
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              className="custom-ghost-btn"
              onClick={() => {
                setIsModalOpen(true);
                setSelectedTheatre(data);
              }}
            >
              <EditOutlined />
            </Button>
            <Button
              danger
              ghost
              style={{ borderColor: "#ff4d4f" }}
              onClick={() => {
                setSelectedTheatre(data);
                setIsDeleteModalOpen(true);
              }}
            >
              <DeleteOutlined />
            </Button>
            {data.isActive && (
              <Button
                className="custom-ghost-btn"
                onClick={() => {
                  setSelectedTheatre(data);
                  setIsShowModalOpen(true);
                }}
              >
                + Shows
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "calc(100vh - 150px)", 
        overflowY: "auto",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <style>
        {`
          .ant-table, .ant-table-container, .ant-table-content, .ant-table-cell {
            background: transparent !important;
          }
          .ant-table-thead > tr > th {
            background: rgba(0,0,0,0.6) !important;
            border-bottom: 1px solid rgba(255,255,255,0.2) !important;
          }
          .ant-table-thead > tr > th::before {
             background-color: transparent !important;
          }
          .ant-table-tbody > tr > td {
            border-bottom: 1px solid rgba(255,255,255,0.2) !important;
          }
          .ant-table-tbody > tr:hover > td {
             background: rgba(255, 255, 255, 0.1) !important;
          }

          /* --- FIX FOR HOVER ISSUE --- */
          .custom-ghost-btn {
            background: transparent !important;
            color: white !important;
            border-color: white !important;
          }

          .custom-ghost-btn:hover {
            color: #ff4d4f !important; /* Changes to red on hover like Add Theatre */
            border-color: #ff4d4f !important;
            background: rgba(255, 255, 255, 0.05) !important; /* Very slight highlight instead of solid white */
          }
          
          /* Pagination Styles */
          .ant-pagination-item a { color: white !important; }
          .ant-pagination-item-active { border-color: red !important; background: transparent !important; }
          .ant-pagination-item-active a { color: red !important; }
          .ant-pagination-prev .ant-pagination-item-link, .ant-pagination-next .ant-pagination-item-link {
             color: white !important;
          }
        `}
      </style>

      <div className="d-flex justify-content-end" style={{ marginBottom: "20px" }}>
        <Button
          onClick={() => {
            setIsModalOpen(!isModalOpen);
            setSelectedTheatre(null);
          }}
          type="primary"
          danger
        >
          Add Theatre
        </Button>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={theatres} 
        pagination={{
            pageSize: 5,
            position: ['bottomCenter'], 
        }}
      />

      {isModalOpen && (
        <TheatreForm
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          fetchTheatreData={getData}
          selectedTheatre={selectedTheatre}
          setSelectedTheatre={setSelectedTheatre}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteTheatreModal
          isDeleteModalOpen={isDeleteModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          fetchTheatreData={getData}
          selectedTheatre={selectedTheatre}
          setSelectedTheatre={setSelectedTheatre}
        />
      )}
      {isShowModalOpen && (
        <ShowModal
          isShowModalOpen={isShowModalOpen}
          setIsShowModalOpen={setIsShowModalOpen}
          selectedTheatre={selectedTheatre}
          setSelectedTheatre={setSelectedTheatre}
        />
      )}
    </div>
  );
};

export default TheatreList;