import "../styles/AuthModal.css";
export default function AuthModal({ onClose }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h2>Login Required</h2>
        <p>Please login or create an account to book this event.</p>

        <div className="modal-actions">
          <a href="/login" className="btn primary">Login</a>
          <a href="/register" className="btn outline">Register</a>
        </div>

        <button className="close-btn" onClick={onClose}>×</button>
      </div>
    </div>
  );
}
