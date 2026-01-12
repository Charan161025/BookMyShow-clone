import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
import { message } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { hideLoading, showLoading } from "../../redux/loaderSlice";
import { getAllMovies } from "../../api/movie";
import {
  addShow,
  updateShow,
  getShowsByTheatre,
  deleteShow,
} from "../../api/show";

const ShowModal = ({
  isShowModalOpen,
  setIsShowModalOpen,
  selectedTheatre,
}) => {
  if (!isShowModalOpen) return null;

  const dispatch = useDispatch();
  const [view, setView] = useState("table");
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [formData, setFormData] = useState({});

  const RED = "#F84464";
  const DARK = "#1f1f1f";
  const INPUT_BG = "#f5f5f5";
  const WHITE = "#fff";
  const BLACK = "#000";

  const s = {
    overlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.85)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    },
    card: {
      width: "1000px",
      background: DARK,
      borderRadius: "14px",
      padding: "30px",
      color: WHITE,
      position: "relative",
    },
    close: {
      position: "absolute",
      top: "14px",
      right: "16px",
      fontSize: "20px",
      cursor: "pointer",
      color: WHITE,
    },
    header: {
      textAlign: "center",
      marginBottom: "20px",
    },
    addBtnWrap: {
      textAlign: "center",
      marginBottom: "20px",
    },
    addBtn: {
      background: RED,
      color: WHITE,
      border: "none",
      borderRadius: "8px",
      padding: "10px 26px",
      fontWeight: "bold",
      cursor: "pointer",
    },
    tableHeader: {
      color: RED,
      padding: "12px",
      fontWeight: "bold",
      borderBottom: "1px solid #444",
      textAlign: "left",
    },
    td: {
      padding: "12px",
      borderBottom: "1px solid #333",
    },
    label: {
      color: RED,
      fontSize: "12px",
      fontWeight: "bold",
      marginBottom: "6px",
      display: "block",
    },
    input: {
      width: "100%",
      padding: "12px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      background: INPUT_BG,
      color: BLACK,
    },
    submit: {
      width: "100%",
      background: RED,
      color: WHITE,
      border: "none",
      borderRadius: "8px",
      padding: "14px",
      fontSize: "16px",
      fontWeight: "bold",
      marginTop: "22px",
      cursor: "pointer",
    },
    back: {
      textAlign: "center",
      marginTop: "12px",
      cursor: "pointer",
      color: "#ccc",
    },
  };

  const loadData = async () => {
    try {
      dispatch(showLoading());
      const [mRes, sRes] = await Promise.all([
        getAllMovies(),
        getShowsByTheatre({ theatreId: selectedTheatre._id }),
      ]);
      if (mRes.success) setMovies(mRes.data);
      if (sRes.success) setShows(sRes.data);
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (showId) => {
    if (!window.confirm("Delete this show?")) return;

    try {
      dispatch(showLoading());
      const res = await deleteShow({ showId });
      if (res.success) {
        message.success(res.message);
        loadData();
      }
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(showLoading());

      if (view === "edit") {
        await updateShow({
          ...formData,
          theatre: selectedTheatre._id,
          showId: formData._id,
        });
      } else {
        const payload = { ...formData };
        delete payload._id;
        await addShow({ ...payload, theatre: selectedTheatre._id });
      }

      message.success("Saved successfully");
      setFormData({});
      setView("table");
      loadData();
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <div style={s.overlay}>
      <div style={s.card}>
        <CloseOutlined
          style={s.close}
          onClick={() => setIsShowModalOpen(false)}
        />

        <div style={s.header}>
          <h2>
            <span style={{ color: RED }}>{selectedTheatre.name}</span>
            <span style={{ color: WHITE }}> | Manage Shows</span>
          </h2>
        </div>

        {view === "table" && (
          <div style={s.addBtnWrap}>
            <button
              style={s.addBtn}
              onClick={() => {
                setFormData({});
                setView("add");
              }}
            >
              + Add Show
            </button>
          </div>
        )}

        {view === "table" && (
          <table width="100%" cellSpacing="0">
            <thead>
              <tr>
                {["Show Name", "Date", "Time", "Movie", "Price", "Seats", "Action"].map(
                  (h) => (
                    <th key={h} style={s.tableHeader}>
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {[...shows]
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((show) => (
                  <tr key={show._id}>
                    <td style={s.td}>{show.name}</td>
                    <td style={s.td}>{moment(show.date).format("DD MMM YYYY")}</td>
                    <td style={s.td}>{show.time}</td>
                    <td style={s.td}>{show.movie.movieName}</td>
                    <td style={s.td}>₹{show.ticketPrice}</td>
                    <td style={s.td}>{show.totalSeats}</td>
                    <td style={s.td}>
                      <EditOutlined
                        style={{
                          color: "#00d4ff",
                          fontSize: 18,
                          marginRight: 14,
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setFormData({
                            ...show,
                            movie: show.movie._id,
                            date: moment(show.date).format("YYYY-MM-DD"),
                          });
                          setView("edit");
                        }}
                      />
                      <DeleteOutlined
                        style={{
                          color: RED,
                          fontSize: 18,
                          cursor: "pointer",
                        }}
                        onClick={() => handleDelete(show._id)}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {(view === "add" || view === "edit") && (
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 20,
              }}
            >
              {[
                ["SHOW NAME", "name"],
                ["DATE", "date", "date"],
                ["TIME", "time", "time"],
                ["MOVIE", "movie", "select"],
                ["TICKET PRICE", "ticketPrice", "number"],
                ["TOTAL SEATS", "totalSeats", "number"],
              ].map(([label, key, type]) => (
                <div key={key}>
                  <label style={s.label}>{label}</label>
                  {type === "select" ? (
                    <select
                      style={s.input}
                      value={formData[key] || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, [key]: e.target.value })
                      }
                      required
                    >
                      <option value="">Select Movie</option>
                      {movies.map((m) => (
                        <option key={m._id} value={m._id}>
                          {m.movieName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={type || "text"}
                      style={s.input}
                      value={formData[key] || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, [key]: e.target.value })
                      }
                      required
                    />
                  )}
                </div>
              ))}
            </div>

            <button type="submit" style={s.submit}>
              {view === "add" ? "Add Show" : "Save Changes"}
            </button>

            <div
              style={s.back}
              onClick={() => {
                setFormData({});
                setView("table");
              }}
            >
              Go Back
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ShowModal;