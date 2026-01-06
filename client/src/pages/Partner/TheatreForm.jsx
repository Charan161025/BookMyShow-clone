import React from "react";
import { Col, Modal, Row, Form, Input, Button, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/loaderSlice";
import { addTheatre, updateTheatre } from "../../api/theatre";

const TheatreForm = ({
  isModalOpen,
  setIsModalOpen,
  selectedTheatre,
  setSelectedTheatre,
  fetchTheatreData,
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  
  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedTheatre(null);
  };
  
  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      let response;
      if (selectedTheatre) {
        response = await updateTheatre({
          ...values,
          theatreId: selectedTheatre._id,
        });
      } else {
        response = await addTheatre({ ...values, owner: user._id });
      }
      if (response?.success === true) {
        message.success(response?.message);
        fetchTheatreData();
        handleCancel();
      } else {
        message.warning(response?.message);
      }
    } catch (error) {
      message.error(error.message || "Something went wrong");
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <Modal
      centered
      open={isModalOpen}
      onCancel={handleCancel}
      width={800}
      footer={null}
      styles={{
        content: {
          backgroundColor: "#1a1a1a",
          border: "1px solid #444",
          padding: "20px",
        },
        header: {
          backgroundColor: "#1a1a1a",
          borderBottom: "1px solid #333",
        },
      }}
    >
      <style>
        {`
          .custom-form .ant-form-item-label > label {
            color: #ff4d4f !important;
            font-weight: bold !important;
          }
          .custom-form .ant-input, .custom-form .ant-input-textarea textarea {
            background-color: #2b2b2b !important;
            color: #ffffff !important;
            border: 1px solid #444 !important;
          }
          .custom-form .ant-input::placeholder {
            color: #777 !important;
          }
          /* Hide arrows in Chrome, Safari, Edge, Opera */
          input::-webkit-outer-spin-button,
          input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          /* Hide arrows in Firefox */
          input[type=number] {
            -moz-appearance: textfield;
          }
          .ant-modal-close-icon {
            color: white !important;
          }
        `}
      </style>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h2 style={{ color: "white", margin: 0 }}>
          {selectedTheatre ? "Edit Theatre" : "Add Theatre"}
        </h2>
      </div>

      <Form
        layout="vertical"
        className="custom-form"
        initialValues={selectedTheatre}
        onFinish={onFinish}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              label="Theatre Name"
              name="name"
              rules={[{ required: true, message: "Required!" }]}
            >
              <Input placeholder="Enter the theatre name" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Theatre Address"
              name="address"
              rules={[{ required: true, message: "Required!" }]}
            >
              <TextArea rows={3} placeholder="Enter the theatre address" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Required!" }]}
            >
              <Input type="email" placeholder="Enter the email" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[
                { required: true, message: "Required!" },
                { pattern: /^[0-9]+$/, message: "Please enter digits only" }
              ]}
            >
              <Input 
                placeholder="Enter the phone number" 
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        
        <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
          {/* CANCEL BUTTON ON LEFT */}
          <Button 
            onClick={handleCancel}
            style={{ 
              flex: 1, 
              height: "40px",
              backgroundColor: "#444", // Made lighter for visibility
              color: "white",
              borderColor: "#666",
              fontWeight: "bold"
            }}
          >
            Cancel
          </Button>

          {/* SUBMIT BUTTON ON RIGHT */}
          <Button
            type="primary"
            htmlType="submit"
            style={{ 
              flex: 1, 
              backgroundColor: "#ff4d4f", 
              borderColor: "#ff4d4f",
              height: "40px",
              fontWeight: "bold"
            }}
          >
            Submit Data
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default TheatreForm;