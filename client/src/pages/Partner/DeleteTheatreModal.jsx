import { message, Button } from "antd";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/loaderSlice";
import { deleteTheatre } from "../../api/theatre";

const DeleteTheatreModal = ({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  selectedTheatre,
  setSelectedTheatre,
  fetchTheatreData,
}) => {
  const dispatch = useDispatch();

  if (!isDeleteModalOpen) return null;

  const handleOk = async () => {
    try {
      dispatch(showLoading());
      const response = await deleteTheatre(selectedTheatre._id);
      if (response.success) {
        message.success(response.message);
        fetchTheatreData();
        handleCancel();
      } else {
        message.warning(response.message);
      }
    } catch (error) {
      message.error(error.message || "Something went wrong");
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedTheatre(null);
  };

  return (
    
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      backdropFilter: "blur(4px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}>
      
     
      <div style={{
        width: "450px",
        backgroundColor: "rgba(20, 20, 20, 0.9)",
        border: "1px solid #444",
        borderRadius: "12px",
        padding: "30px",
        textAlign: "center",
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.8)",
      }}>
        
        
        <h2 style={{ 
          color: "#ff4d4f", 
          margin: "0 0 15px 0", 
          fontSize: "22px", 
          fontWeight: "bold" 
        }}>
          Delete Theatre
        </h2>
        
        <hr style={{ border: "0.5px solid #333", marginBottom: "25px" }} />

      
        <p style={{ 
          color: "white", 
          fontSize: "18px", 
          fontWeight: "500", 
          margin: "0 0 10px 0" 
        }}>
          Are you sure you want to delete this theatre?
        </p>
        
        <h3 style={{ 
          color: "#ff4d4f", 
          margin: "10px 0 20px 0", 
          fontSize: "20px",
          fontWeight: "bold"
        }}>
          {selectedTheatre?.name}
        </h3>

        <p style={{ 
          color: "#aaa", 
          fontSize: "14px", 
          marginBottom: "30px",
          lineHeight: "1.5"
        }}>
          This action can't be undone and you'll lose this theatre data.
        </p>

        
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: "20px" 
        }}>
          <button
            onClick={handleCancel}
            style={{
              backgroundColor: "transparent",
              color: "white",
              border: "1px solid #666",
              borderRadius: "8px",
              height: "45px",
              width: "110px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "0.3s"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.1)"}
            onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
          >
            Cancel
          </button>
          
          <button
            onClick={handleOk}
            style={{
              backgroundColor: "#ff4d4f",
              color: "white",
              border: "none",
              borderRadius: "8px",
              height: "45px",
              width: "110px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(255, 77, 79, 0.3)"
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTheatreModal;