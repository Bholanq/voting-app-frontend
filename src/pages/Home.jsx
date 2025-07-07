import { useNavigate } from 'react-router-dom';
import '../index.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="form-container">
      <div style={{
        backgroundColor: "#1e1e1e",
        padding: "2rem",
        borderRadius: "8px",
        textAlign: "center",
        minWidth: "300px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.6)"
      }}>
        <h1>Welcome to the Voting App</h1>
        <p>Please log in or register to continue.</p>

        <div style={{ marginTop: "1.5rem" }}>
          <button
            onClick={() => navigate("/login")}
            style={{ marginRight: "1rem", padding: "0.5rem 1rem" }}
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            style={{ padding: "0.5rem 1rem" }}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
