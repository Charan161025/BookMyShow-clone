import { Tabs } from "antd";
import React from "react";
import MovieTable from "./MovieTable";
import TheatreTable from "./TheatreTable";

const Admin = () => {
  const tabItems = [
    {
      key: "movies",
      label: <span style={{ color: "#ff0000", fontSize: "16px" }}>Movies</span>, // Red Text
      children: <MovieTable />,
    },
    {
      key: "theatre",
      label: <span style={{ color: "#ffffff", fontSize: "16px" }}>Theatres</span>, // White Text
      children: <TheatreTable />,
    },
  ];

  return (
    <div style={{ padding: "0px 20px" }}>
      {/* CSS to change the blue tab line to white */}
      <style>
        {`
          .ant-tabs-ink-bar {
            background: white !important;
            height: 3px !important;
          }
          .ant-tabs-top > .ant-tabs-nav::before {
             border-bottom: 1px solid rgba(255,255,255,0.2) !important;
          }
        `}
      </style>

      <h1
        style={{
          fontSize: "22px",
          marginTop: "10px",
          marginBottom: "5px",
          color: "white",
          textShadow: "0px 2px 4px rgba(0,0,0,0.7)",
        }}
      >
        Admin Dashboard
      </h1>

      <Tabs
        defaultActiveKey="movies"
        items={tabItems}
        tabBarStyle={{ marginBottom: "10px" }}
      />
    </div>
  );
};

export default Admin;