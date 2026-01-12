import { useNavigate, Link } from "react-router-dom";
import { Button, Form, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { ForgetPassword } from "../api/user";
import { MailOutlined } from "@ant-design/icons";

const Forget = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await ForgetPassword(values);
      if (response.success) {
        message.success(response.message);
        alert("OTP sent to your email");
        navigate("/reset");
      } else {
        if (response.message === "Please use otp sent on mail") {
          message.warning("Please use existing otp");
          navigate("/reset");
        } else {
          message.warning(response.message);
        }
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(hideLoading());
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

          /* --- 2. DARK GLASS CARD (SIZE KEPT ORIGINAL) --- */
          .content-card {
            position: relative;
            z-index: 1;
            background-color: rgba(0, 0, 0, 0.75); 
            padding: 40px; /* Kept big padding */
            max-width: 400px; /* Kept standard width */
            width: 100%;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.8);
            color: #fff;
            border: 1px solid rgba(255,255,255,0.1); 
          }

          /* --- TEXT SIZE REDUCED HERE --- */
          .title-white { 
            color: #fff; 
            font-weight: 700; 
            margin-bottom: 25px; 
            text-align: center; 
            font-size: 22px; /* Much smaller than before, fits on one line */
            letter-spacing: 0.5px;
          }
          
          .ant-form-item-label > label { color: #ccc !important; }

          /* --- 3. INPUTS --- */
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

          /* Autofill Fix */
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
          .ant-input-prefix { color: #fff !important; }

          /* --- 4. BUTTON & LINKS --- */
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
          <h1 className="title-white">Forgot Password</h1>
        </section>

        <section>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Email"
              htmlFor="email"
              name="email"
              className="d-block"
              rules={[{ required: true, message: "Email is required" }]}
            >
              <Input
                id="email"
                type="text"
                placeholder="Enter your Email"
                prefix={<MailOutlined />} 
                size="large"
              />
            </Form.Item>

            <Form.Item className="d-block">
              <Button block htmlType="submit" className="red-btn">
                SEND OTP
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-3">
            <p>
              Existing User?{" "}
              <Link to="/login" className="link-red">
                Login Here
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Forget;