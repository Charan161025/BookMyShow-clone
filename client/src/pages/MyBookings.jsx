import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { getAllBookings } from "../api/booking";
import { Button, Card, Col, Row, message } from "antd";
import moment from "moment";
import { Link } from "react-router-dom";

const MyBookings = () => {
  const dispatch = useDispatch();
  const [bookings, setBookings] = useState([]);

  const getData = async () => {
    try {
      dispatch(showLoading());
      const response = await getAllBookings();
      if (response.success) {
        setBookings(response.data);
      } else {
        message.warning(response.message);
      }
    } catch (err) {
      message.error(err.message);
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {bookings.length > 0 && (
        <Row gutter={[24, 24]} style={{ padding: "20px" }}>
          {bookings.map((booking) => (
            <Col key={booking._id} xs={24} lg={12}>
              <Card
                bordered={false}
                style={{
                  background: "rgba(0,0,0,0.45)",
                  backdropFilter: "blur(6px)",
                  color: "#fff",
                  borderRadius: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    alignItems: "flex-start",
                  }}
                >
                 
                  <img
                    src={booking.show?.movie?.poster}
                    alt="Movie Poster"
                    style={{
                      width: "110px",
                      height: "160px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      flexShrink: 0,
                    }}
                  />

                 
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        color: "#fff",
                        marginBottom: "6px",
                        fontWeight: "600",
                      }}
                    >
                      {booking.show?.movie?.movieName}
                    </h3>

                    <p>
                      <span style={{ color: "#ff4d4f" }}>
                        Theatre:
                      </span>{" "}
                      <span style={{ color: "#fff" }}>
                        {booking.show?.theatre?.name}
                      </span>
                    </p>

                    <p>
                      <span style={{ color: "#ff4d4f" }}>
                        Seats:
                      </span>{" "}
                      <span style={{ color: "#fff" }}>
                        {booking.seats?.join(", ")}
                      </span>
                    </p>

                    <p>
                      <span style={{ color: "#ff4d4f" }}>
                        Date & Time:
                      </span>{" "}
                      <span style={{ color: "#fff" }}>
                        {moment(booking.show?.date).format(
                          "MMM Do YYYY"
                        )}{" "}
                        |{" "}
                        {moment(
                          booking.show?.time,
                          "HH:mm"
                        ).format("hh:mm A")}
                      </span>
                    </p>

                    <p>
                      <span style={{ color: "#ff4d4f" }}>
                        Amount:
                      </span>{" "}
                      <span style={{ color: "#fff" }}>
                        ₹
                        {(booking.seats?.length || 0)*
                          (booking.show?.ticketPrice || 0)}
                      </span>
                    </p>

                    <p>
                      <span style={{ color: "#ff4d4f" }}>
                        Booking ID:
                      </span>{" "}
                      <span
                        style={{
                          color: "#fff",
                          wordBreak: "break-all",
                        }}
                      >
                        {booking.transactionId}
                      </span>
                    </p>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {bookings.length === 0 && (
        <div
          style={{
            textAlign: "center",
            paddingTop: "40px",
            color: "#fff",
          }}
        >
          <h2>You’ve not booked any show yet!</h2>
          <Link to="/">
            <Button
              type="primary"
              style={{
                background: "#ff4d4f",
                border: "none",
                marginTop: "15px",
              }}
            >
              Start Booking
            </Button>
          </Link>
        </div>
      )}
    </>
  );
};

export default MyBookings;