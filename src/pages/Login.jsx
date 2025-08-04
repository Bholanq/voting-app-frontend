// C:\Users\akash\OneDrive\Desktop\votingapp\frontend\src\pages\Login.jsx

import { useState } from 'react';
import { loginUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../index.css';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true
    setMessage('');

    try {
      const res = await loginUser(formData);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/voter");
      }

    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
      setLoading(false); // Set loading to false only on failure
    }
    // No need to set loading to false on success because the component will unmount
  };

  return (
    <div className="form-container">
      <button onClick={() => navigate('/')} className="top-left-button">
        Go Back
      </button>

      <form onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          disabled={loading} // Disable input during loading
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={loading} // Disable input during loading
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

export default Login;