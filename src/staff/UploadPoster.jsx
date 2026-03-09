
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api/config";
import "../styles/CreateEvent.css";

export default function UploadPoster() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const upload = async () => {
    if (!file) { setMessage({ text: "Please select an image.", type: "error" }); return; }
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const fd = new FormData();
      fd.append("poster", file);
      const res = await fetch(`${API_BASE_URL}/api/events/${eventId}/poster`, {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) { setMessage({ text: data.message || "Upload failed.", type: "error" }); return; }
      setMessage({ text: "Poster uploaded successfully!", type: "success" });
      setTimeout(() => navigate("/staff/events"), 1500);
    } catch {
      setMessage({ text: "Server error.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/staff/events")}>← Back</button>
        <h1>Upload Event Poster</h1>
        <p>JPG/PNG recommended · Max 5 MB</p>
      </div>

      <div className="form-card">
        <div className="poster-upload-zone" onClick={() => document.getElementById("poster-input").click()}>
          {preview ? (
            <img src={preview} alt="Preview" className="poster-preview" />
          ) : (
            <div className="poster-placeholder">
              <span>🖼️</span>
              <p>Click to select image</p>
            </div>
          )}
        </div>
        <input id="poster-input" type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />

        {preview && (
          <p style={{ textAlign: "center", color: "#64748b", fontSize: ".85rem", marginTop: "8px" }}>{file?.name}</p>
        )}

        {message.text && <div className={`form-msg ${message.type}`}>{message.text}</div>}

        <button className="btn-submit" onClick={upload} disabled={loading || !file}>
          {loading ? "Uploading…" : "Upload Poster"}
        </button>
      </div>
    </div>
  );
}