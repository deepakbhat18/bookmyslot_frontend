import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../api/config";

export default function UploadPoster() {
  const { eventId } = useParams();

  const upload = async (file) => {
    const fd = new FormData();
    fd.append("poster", file);

    await fetch(`${API_BASE_URL}/api/events/${eventId}/poster`, {
      method: "POST",
      credentials: "include",
      body: fd
    });

    alert("Poster uploaded");
  };

  return (
    <input type="file" onChange={e => upload(e.target.files[0])} />
  );
}
