import React from "react";
import { Button, Form, Input, message, Radio } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { RegisterUser } from "../api/user";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";

const Register = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await RegisterUser(values);
      console.log(response);
      if (response?.success) {
        message.success(response?.message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        message.warning(response?.message);
      }
    } catch (error) {
      message.error(error.message || "Something went wrong");
    }
  };

  return (
    <div className="main-wrapper">
      <style>
        {`
          /* --- 1. SAME BACKGROUND AS LOGIN --- */
          .main-wrapper {
            background-image: url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop'); 
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
          }
          .main-wrapper::before {
            content: "";
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.6); 
            z-index: 0;
          }

          /* --- 2. DARK GLASS CARD --- */
          .content-card {
            position: relative;
            z-index: 1;
            background-color: rgba(0, 0, 0, 0.75); 
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.8);
            width: 100%;
            max-width: 450px; 
            color: #fff;
            border: 1px solid rgba(255,255,255,0.1); 
          }

          /* --- UPDATED TITLE SIZE HERE --- */
          .title-white { 
            color: #fff; 
            font-weight: bold; 
            margin-bottom: 20px; 
            text-align: center; 
            font-size: 1.5rem; /* Reduced size (Default h1 is usually 2rem) */
          }
          
          .ant-form-item-label > label { color: #ccc !important; }

          /* --- 3. INPUT FIXES (SAME AS LOGIN) --- */
          .ant-input-affix-wrapper {
            background-color: #333 !important; 
            border: 1px solid #444 !important;
            color: #fff !important;
            padding: 8px 11px !important;
            box-shadow: none !important;
          }
          .ant-input {
            background-color: transparent !important;
            border: none !important;
            box-shadow: none !important;
            color: white !important;
          }

          input:-webkit-autofill,
          input:-webkit-autofill:hover, 
          input:-webkit-autofill:focus, 
          input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 1000px #333 inset !important;
            -webkit-text-fill-color: white !important;
            transition: background-color 5000s ease-in-out 0s;
          }

          .ant-input-affix-wrapper:focus, 
          .ant-input-affix-wrapper-focused,
          .ant-input-affix-wrapper:focus-within {
             border-color: #e50914 !important;
             box-shadow: 0 0 0 2px rgba(229, 9, 20, 0.2) !important;
             background-color: #333 !important;
          }

          .ant-input::placeholder { color: rgba(255, 255, 255, 0.7) !important; }
          .ant-input-prefix, .ant-input-suffix { color: #fff !important; }

          /* --- 4. RADIO BUTTONS --- */
          .ant-radio-wrapper { color: #fff !important; }
          .ant-radio-checked .ant-radio-inner {
            border-color: #e50914 !important;
            background-color: #e50914 !important;
          }
          .ant-radio:hover .ant-radio-inner { border-color: #e50914; }

          /* --- 5. RED BUTTON & LINKS --- */
          .red-btn {
            background-color: #e50914 !important;
            border-color: #e50914 !important;
            color: #fff !important;
            font-weight: bold;
            height: 40px;
            border-radius: 4px;
            font-size: 1rem;
          }
          .red-btn:hover {
            background-color: #b2070f !important;
            border-color: #b2070f !important;
          }
          .link-red { color: #e50914; font-weight: 500; }
          .link-red:hover { text-decoration: underline; color: #ff4040; }
        `}
      </style>

      <main className="content-card">
        <section>
          <h1 className="title-white">Register to BookMyShow</h1>
        </section>

        <section>
          <Form layout="vertical" onFinish={onFinish}>
            {/* NAME FIELD */}
            <Form.Item
              label="Name"
              htmlFor="name"
              name="name"
              rules={[{ required: true, message: "Name is Required" }]}
            >
              <Input
                id="name"
                type="text"
                placeholder="Enter your Name"
                prefix={<UserOutlined />}
                size="large"
              />
            </Form.Item>

            {/* EMAIL FIELD */}
            <Form.Item
              label="Email"
              name="email"
              htmlFor="email"
              rules={[{ required: true, message: "Email is required" }]}
            >
              <Input
                type="email"
                placeholder="Enter your Email"
                prefix={<MailOutlined />}
                size="large"
              />
            </Form.Item>

            {/* PASSWORD FIELD */}
            <Form.Item
              label="Password"
              name="password"
              htmlFor="password"
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input.Password
                placeholder="Enter your Password"
                prefix={<LockOutlined />}
                size="large"
              />
            </Form.Item>

            {/* ROLE SELECTION */}
            <Form.Item
              label="Register as a Partner"
              htmlFor="role"
              name="role"
              initialValue={false}
              rules={[{ required: true, message: "Please select an option" }]}
            >
              <div className="d-flex justify-content-start">
                <Radio.Group
                  name="role"
                  className="flex-start"
                  options={[
                    { value: "partner", label: "Yes" },
                    { value: "user", label: "No" },
                  ]}
                />
              </div>
            </Form.Item>

            {/* SUBMIT BUTTON */}
            <Form.Item>
              <Button block htmlType="submit" className="red-btn">
                Register
              </Button>
            </Form.Item>
          </Form>
        </section>

        <section className="text-center">
          <p>
            Already a user?{" "}
            <Link to="/login" className="link-red">
              Login Now
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
};

export default Register;