import { Button, message, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/loaderSlice";
import { getAlltheatres, updateTheatre } from "../../api/theatre";
import { CheckCircleOutlined, StopOutlined } from "@ant-design/icons";

const TheatreTable = () => {
  const dispatch = useDispatch();
  const [theatres, setTheatres] = useState([]);

  const handleStatusChange = async (theatre) => {
    try {
      dispatch(showLoading());
      const payload = {
        ...theatre,
        isActive: !theatre.isActive,
      };
      const response = await updateTheatre(payload);
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        message.warning(response.message);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(hideLoading());
    }
  };

  const getData = async () => {
    try {
      dispatch(showLoading());
      const response = await getAlltheatres();
      if (response.success) {
        setTheatres(response?.data);
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

  
  const baseColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
    },
    {
      title: "Owner",
      dataIndex: "owner",
      render: (text, data) => {
        return data.owner && data.owner.name;
      },
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (status, data) => {
        if (data.isActive) {
          return <Tag color="success">Approved</Tag>;
        } else {
          return <Tag color="warning">Pending/Blocked</Tag>;
        }
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, data) => {
        return (
          <div className="d-flex align-items-center gap-10">
            {data.isActive ? (
              <Button
                type="primary"
                danger
                icon={<StopOutlined />}
                onClick={() => handleStatusChange(data)}
                size="small"
              >
                Block
              </Button>
            ) : (
              <Button
                type="primary"
                style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                icon={<CheckCircleOutlined />}
                onClick={() => handleStatusChange(data)}
                size="small"
              >
                Approve
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  
  const columns = baseColumns.map((col, index) => ({
    ...col,
    onHeaderCell: () => ({
      style: {
        backgroundColor: "transparent", 
        color: index % 2 === 0 ? "#e50914" : "#ffffff", 
        fontWeight: "bold",
        borderBottom: "1px solid #444", 
      },
    }),
    onCell: () => ({
      style: {
        backgroundColor: "transparent", 
        color: "#ffffff", 
        borderBottom: "1px solid #444",
      },
    }),
  }));

  return (
    <div>
      
      <style>
        {`
          .ant-table {
            background: transparent !important;
            color: white !important;
          }
          .ant-table-thead > tr > th {
            background: transparent !important;
            border-bottom: 1px solid #444 !important;
          }
          .ant-table-tbody > tr > td {
            border-bottom: 1px solid #444 !important;
          }
          /* Hover effect: Slight grey tint, keeps text white */
          .ant-table-tbody > tr:hover > td {
            background: rgba(255, 255, 255, 0.1) !important;
          }
          /* Pagination buttons */
          .ant-pagination-item a {
            color: white !important;
          }
          .ant-pagination-item-active {
            background: transparent !important;
            border-color: #e50914 !important;
          }
          .ant-pagination-item-active a {
            color: #e50914 !important;
          }
          .ant-table-placeholder {
             background: transparent !important;
          }
          .ant-empty-description {
             color: white !important;
          }
        `}
      </style>

      <Table
        dataSource={theatres}
        columns={columns}
        rowKey="_id"
        scroll={{ x: "max-content" }}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default TheatreTable;