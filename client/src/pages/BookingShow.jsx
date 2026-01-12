import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";

import { showLoading, hideLoading } from "../redux/loaderSlice";
import { getShowById } from "../api/show";
import { makePayment, bookShow } from "../api/booking";

const BookingShow = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  
  const getData = async () => {
    try {
      dispatch(showLoading());
      const res = await getShowById({ showId: id });
      if (res.success) setShow(res.data);
      else message.warning(res.message);
    } catch (err) {
      message.error(err.message);
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getData();
  }, []);

  
  const renderSeats = () => {
    if (!show) return null;

    const columns = 14;
    const rows = Math.ceil(show.totalSeats / columns);
    const rowLabelWidth = 36; 
    const seatGap = 8;

    return (
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            color: "#ff4d4f",
            fontWeight: "600",
            marginBottom: "6px",
            letterSpacing: "1px",
          }}
        >
          Screen this side
        </p>

        
        <div
          style={{
            width: "60%",
            height: "4px",
            background: "#ff4d4f",
            margin: "8px auto 22px",
            borderRadius: "4px",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "10px",
          }}
        >
          
          <div style={{ width: rowLabelWidth + 10 }} />

         
          <div style={{ display: "flex", gap: `${seatGap}px` }}>
            {Array.from({ length: columns }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: "28px",
                  textAlign: "center",
                  color: "#ccc",
                  fontSize: "12px",
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        
        {Array.from({ length: rows }).map((_, row) => {
          const rowLabel = String.fromCharCode(65 + row);

          return (
            <div
              key={row}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "10px",
              }}
            >
             
              <div
                style={{
                  width: rowLabelWidth,
                  color: "#ccc",
                  fontSize: "12px",
                  textAlign: "right",
                  marginRight: "10px",
                }}
              >
                {rowLabel}
              </div>

              
              <div style={{ display: "flex", gap: `${seatGap}px` }}>
                {Array.from({ length: columns }).map((_, col) => {
                  const seatLabel = `${rowLabel}${col + 1}`;
                  const index = row * columns + col;
                  if (index >= show.totalSeats) return null;

                  const isBooked = show.bookedSeats.includes(seatLabel);
                  const isSelected = selectedSeats.includes(seatLabel);

                  return (
                    <div
                      key={seatLabel}
                      onClick={() => {
                        if (!isBooked) {
                          setSelectedSeats((prev) =>
                            prev.includes(seatLabel)
                              ? prev.filter((s) => s !== seatLabel)
                              : [...prev, seatLabel]
                          );
                        }
                      }}
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "6px",
                        background: isBooked
                          ? "#333"
                          : isSelected
                          ? "#ff4d4f"
                          : "rgba(255,255,255,0.25)",
                        cursor: isBooked ? "not-allowed" : "pointer",
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  
  const handlePayment = async () => {
    if (!selectedSeats.length) return message.warning("Select seats");

    try {
      setIsProcessing(true);
      dispatch(showLoading());

      const res = await makePayment({
        amount: selectedSeats.length * show.ticketPrice * 100,
      });

      if (!res.success) return message.error(res.message);

      const { orderId, keyId, currency } = res.data;

      new window.Razorpay({
        key: keyId,
        amount: selectedSeats.length * show.ticketPrice * 100,
        currency,
        order_id: orderId,
        name: "BookMyShow",
        handler: async (response) => {
          await bookShow({
            show: id,
            seats: selectedSeats,
            user: user._id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });
          navigate("/myBookings");
        },
        theme: { color: "#ff4d4f" },
      }).open();
    } catch {
      message.error("Payment failed");
    } finally {
      setIsProcessing(false);
      dispatch(hideLoading());
    }
  };

  
  return show ? (
    <Row gutter={24} style={{ padding: "20px" }}>
      <Col span={showDetails ? 16 : 24}>
        <Card
          bordered={false}
          style={{
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(6px)",
            color: "#fff",
          }}
          title={
            <div>
              <h2 style={{ fontSize: "26px", marginBottom: "4px" }}>
                {show.movie.movieName}
              </h2>
              <p style={{ color: "#ff4d4f", margin: 0 }}>
                {show.theatre.name}, {show.theatre.address}
              </p>
            </div>
          }
          extra={
            <Button
              type="primary"
              style={{ background: "#ff4d4f", border: "none" }}
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? "Close" : "Click here for show details"}
            </Button>
          }
        >
          {renderSeats()}

          {selectedSeats.length > 0 && (
            <div
              style={{
                marginTop: "25px",
                padding: "20px",
                background: "rgba(0,0,0,0.5)",
                borderRadius: "12px",
                textAlign: "center",
              }}
            >
              <h3>Selected Seats: {selectedSeats.join(", ")}</h3>
              <h3>
                Total Amount: ₹
                {selectedSeats.length * show.ticketPrice}
              </h3>

              <Button
                type="primary"
                size="large"
                block
                style={{ background: "#ff4d4f", border: "none" }}
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Pay Now"}
              </Button>
            </div>
          )}
        </Card>
      </Col>

      {showDetails && (
        <Col span={8}>
          <Card
            bordered={false}
            style={{
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(6px)",
              color: "#fff",
            }}
          >
            <h3>Show Details</h3>
            <p>
              <b>Date:</b> {moment(show.date).format("MMM Do YYYY")}
            </p>
            <p>
              <b>Time:</b>{" "}
              {moment(show.time, "HH:mm").format("hh:mm A")}
            </p>
            <p>
              <b>Seat Price:</b> ₹{show.ticketPrice}
            </p>
            <p>
              <b>Available Seats:</b>{" "}
              {show.totalSeats - show.bookedSeats.length}
            </p>
          </Card>
        </Col>
      )}
    </Row>
  ) : (
    <div style={{ color: "#fff", textAlign: "center" }}>
      Show does not exist
    </div>
  );
};

export default BookingShow;