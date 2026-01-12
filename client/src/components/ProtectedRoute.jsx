import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { Layout, message } from "antd";
import { GetCurrentUser } from "../api/user";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/userSlice";
import { Content, Header } from "antd/es/layout/layout";
import {
  HomeOutlined,
  LogoutOutlined,
  BookOutlined,
  UserOutlined,
} from "@ant-design/icons";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getValidUser = async () => {
    try {
      dispatch(showLoading());
      const response = await GetCurrentUser();
      if (response.success) {
        dispatch(setUser(response?.data));
      } else {
        message.warning(response?.message);
        navigate("/login");
      }
    } catch (error) {
      message.error(error.message);
      navigate("/login");
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    if (localStorage.getItem("tokenForBMS")) {
      getValidUser();
    } else {
      navigate("/login");
    }
  }, []);

  
  const NavItem = ({ to, icon, label, action, textColor }) => {
    return (
      <div
        onClick={() => (action ? action() : navigate(to))}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
          color: textColor, 
          fontSize: "16px",
          padding: "8px 15px",
          fontWeight: "500",
          transition: "all 0.2s",
        }}
      >
        {icon}
        <span>{label}</span>
      </div>
    );
  };

  return (
    user && (
      <Layout
        style={{
          minHeight: "100vh",
          width: "100vw",
          background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed", 
        }}
      >
       
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "transparent", 
            padding: "0 30px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
            backdropFilter: "blur(5px)",
          }}
        >
          <div onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            <h3 style={{ color: "white", margin: 0, fontSize: "24px", letterSpacing: "1px" }}>
              Book<span style={{ color: "#ff4d4f" }}>My</span>Show
            </h3>
          </div>

          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            
          
            <NavItem 
              to="/" 
              label="Home" 
              icon={<HomeOutlined />} 
              textColor="#ff4d4f" 
            />
            
           
            <NavItem 
                to={user.role === "admin" ? "/admin" : user.role === "partner" ? "/partner" : "/myBookings"}
                label={user.role === "admin" ? "Admin" : user.role === "partner" ? "Partner" : "My Bookings"}
                icon={<BookOutlined />}
                textColor="white"
            />
          {(user.role?.toLowerCase() === "admin" || user.role?.toLowerCase() === "partner") && (
            <NavItem
            to="/myBookings"
            label="My Bookings"
            icon={<BookOutlined />}
            textColor="white"
            />
          )}

            <NavItem 
              to="/profile" 
              label={user.name} 
              icon={<UserOutlined />} 
              textColor="#ff4d4f"
            />
            
         
            <NavItem
              to="/login"
              label="Logout"
              icon={<LogoutOutlined />}
              action={() => {
                localStorage.removeItem("tokenForBMS");
                navigate("/login");
              }}
              textColor="white"
            />
          </div>
        </Header>

       
        <Content
          style={{
            padding: "20px",
            width: "100%",
            margin: 0,
            minHeight: "80vh",
          }}
        >
          {children}
        </Content>
      </Layout>
    )
  );
};

export default ProtectedRoute;