// frontend\src\pages\Register.jsx

import { useState } from 'react';
import { registerUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../index.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true); // Set loading to true
    setMessage('');

    try {
      const { username, password } = formData;
      const res = await registerUser({ username, password });
      setMessage("Registration successful! You can now log in.");
      // Clear form on success
      setFormData({ username: '', password: '', confirmPassword: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false); // Set loading to false
    }
  };

 return (
    <div className="form-container">
      <button onClick={() => navigate('/')} className="top-left-button">
        Go Back
      </button>

      <form onSubmit={handleSubmit}>
        <h2>Register</h2>

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

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          disabled={loading} // Disable input during loading
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>

        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

export default Register;