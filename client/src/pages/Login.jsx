
import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { LoginUser } from "../api/user";

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await LoginUser(values);
      if (response?.success) {
        message.success(response?.message);
        localStorage.setItem("tokenForBMS", response?.data);
        setTimeout(() => {
          navigate("/");
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
          /* --- 1. BACKGROUND --- */
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

          /* --- 2. DARK CARD --- */
          .content-card {
            position: relative;
            z-index: 1;
            background-color: rgba(0, 0, 0, 0.75); 
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.8);
            width: 100%;
            max-width: 400px;
            color: #fff;
            border: 1px solid rgba(255,255,255,0.1); 
          }

          .title-white { color: #fff; font-weight: bold; margin-bottom: 5px; }
          .ant-form-item-label > label { color: #ccc !important; }

          /* --- 3. FIX FOR "BOX IN BOX" AND WHITE BACKGROUND --- */
          
          /* The Outer Wrapper (The only box we want) */
          .ant-input-affix-wrapper {
            background-color: #333 !important; 
            border: 1px solid #444 !important;
            color: #fff !important;
            padding: 8px 11px !important;
            box-shadow: none !important; /* Removes any outer glow conflicts */
          }

          /* The Inner Input (Make it invisible/transparent so no double box) */
          .ant-input {
            background-color: transparent !important;
            border: none !important;
            box-shadow: none !important;
            color: white !important;
          }

          /* THE NUCLEAR FIX: Stops browser from turning it white on click/autofill */
          input:-webkit-autofill,
          input:-webkit-autofill:hover, 
          input:-webkit-autofill:focus, 
          input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 1000px #333 inset !important; /* Force dark background */
            -webkit-text-fill-color: white !important;
            transition: background-color 5000s ease-in-out 0s;
          }

          /* Focus State: Only change the border color of the wrapper */
          .ant-input-affix-wrapper:focus, 
          .ant-input-affix-wrapper-focused,
          .ant-input-affix-wrapper:focus-within {
             border-color: #e50914 !important;
             box-shadow: 0 0 0 2px rgba(229, 9, 20, 0.2) !important;
             background-color: #333 !important;
          }

          /* Placeholder Text */
          .ant-input::placeholder {
            color: rgba(255, 255, 255, 0.7) !important; 
          }
          
          /* Icons */
          .ant-input-prefix, .ant-input-suffix { 
            color: #fff !important; 
          }

          /* --- 4. RED BUTTON --- */
          .red-btn {
            background-color: #e50914 !important;
            border-color: #e50914 !important;
            color: #fff !important;
            font-weight: bold;
            height: 40px;
            border-radius: 4px;
            font-size: 16px;
            margin-top: 10px;
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
        <header className="text-center mb-4">
          <h2 className="title-white">Login to BookMyShow</h2>
        </header>

        <section>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Email is required" }]}
              className="mb-4"
            >
              
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter your Email"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Password is required" }]}
              className="mb-5"
            >
            
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your Password"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button htmlType="submit" block className="red-btn">
                Login
              </Button>
            </Form.Item>
          </Form>
        </section>

        <section className="text-center mt-3">
          <p style={{ color: "#aaa", marginBottom: "10px" }}>
            New User?{" "}
            <Link to="/register" className="link-red">
              Register Here
            </Link>
          </p>
          <p>
            <Link
              to="/forget"
              className="link-red"
              style={{ fontSize: "0.9rem" }}
            >
              Forgot Password?
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
};

export default Login;