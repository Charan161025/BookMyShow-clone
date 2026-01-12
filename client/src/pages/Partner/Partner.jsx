import { Tabs } from "antd";
import TheatreList from "./TheatreList";

const Partner = () => {
  const items = [
    {
      key: "theatres",
      label: <span style={{ color: "red", fontWeight: "bold", fontSize: "16px" }}>Theatres</span>,
      children: <TheatreList />,
    },
  ];
  return (
    <div style={{ padding: "0 15px" }}>
      <style>
        {`
          .ant-tabs-ink-bar {
            background-color: red !important;
          }
          .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
            color: red !important;
          }
        `}
      </style>
      <Tabs defaultActiveKey="theatres" items={items} />
    </div>
  );
};

export default Partner;