import { useState } from 'react';
import { registerUser } from '../services/api';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../index.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const { username, password } = formData;
      const res = await registerUser({ username, password });
      setMessage(res.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed');
    }
  };

 return (
    <div className="form-container">
      {/* Add the "top-left-button" class here */}
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
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit">Register</button>

        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

export default Register;