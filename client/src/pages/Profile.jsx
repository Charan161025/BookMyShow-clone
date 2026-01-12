
import { useSelector } from "react-redux";

const Profile = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="profile-page-wrapper">
      
      <style>
        {`
          /* 1. Page Wrapper */
          .profile-page-wrapper {
            min-height: 85vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          }

          /* 2. Transparent Container */
          .transparent-profile-container {
            position: relative;
            width: 100%;
            max-width: 700px;
            background: transparent;
            backdrop-filter: none;
            border: none;
            box-shadow: none;
            padding: 20px;
            display: flex;
            flex-direction: row;
            gap: 50px;
            align-items: center;
            text-shadow: 0 2px 10px rgba(0,0,0,0.9);
          }

          @media (max-width: 768px) {
            .transparent-profile-container {
              flex-direction: column;
              text-align: center;
              gap: 30px;
            }
          }

          /* 3. Left Section */
          .profile-left {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }

          /* Avatar Glow Ring */
          .avatar-container {
            position: relative;
            width: 150px;
            height: 150px;
            border-radius: 50%;
            padding: 4px;
            background: linear-gradient(45deg, #00f260, #0575e6);
            box-shadow: 0 0 40px rgba(5, 117, 230, 0.6); 
            margin-bottom: 20px;
          }

          .profile-pic-img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid #1a1a1a;
            background-color: #1a1a1a;
          }

          /* 4. Text Styles */
          .user-name {
            font-size: 32px;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: 1px;
            margin: 0;
            text-transform: uppercase;
          }

          .user-email {
            font-size: 16px;
            color: rgba(255, 255, 255, 0.9);
            margin-top: 5px;
            margin-bottom: 25px;
          }

          /* 5. Role Badge - UPDATED */
          .role-badge {
            background: #ffffff;  /* White Box */
            color: #000000;       /* Black Text */
            padding: 8px 24px;
            border-radius: 5px;
            font-weight: 800;
            font-size: 14px;
            letter-spacing: 1.5px;
            box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2); /* White/Bright shadow */
            text-transform: uppercase;
            display: inline-block;
            text-shadow: none;
          }

          /* 6. Right Section */
          .profile-right {
            flex: 1.2;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start; 
          }
          @media (max-width: 768px) {
             .profile-right {
                align-items: center;
             }
          }

          .info-group {
            margin-bottom: 30px;
          }
          .info-label {
            display: block;
            font-size: 13px;
            color: rgba(255, 255, 255, 0.7);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
          }
          .info-value {
            font-size: 18px;
            color: #fff;
            font-family: monospace;
            background: transparent;
            padding: 0;
            border: none;
            display: inline-block;
            font-weight: 600;
            letter-spacing: 1px;
          }

           /* Status styles */
           .status-active {
             color: #4ade80;
             display: flex;
             align-items: center;
             gap: 10px;
             font-weight: 600;
             font-size: 18px;
           }
           .status-dot {
             width: 12px;
             height: 12px;
             border-radius: 50%;
             background: #4ade80;
             box-shadow: 0 0 15px #4ade80;
           }
        `}
      </style>

      
      <div className="transparent-profile-container">

        
        <div className="profile-left">
          <div className="avatar-container">
            <img
              src={
                user.image ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="Profile"
              className="profile-pic-img"
            />
          </div>
          <h2 className="user-name">{user?.name}</h2>
          <p className="user-email">{user?.email}</p>

          
          <div className="role-badge">
            {user.role ? user.role.toUpperCase() : "USER"}
          </div>
        </div>

        
        <div className="profile-right">

          <div className="info-group">
            <span className="info-label">User ID Reference</span>
            <div className="info-value">
              {user._id}
            </div>
          </div>

          <div className="info-group">
            <span className="info-label">Account Status</span>
            <div className="status-active">
               <div className="status-dot"></div>
               Active Member
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;