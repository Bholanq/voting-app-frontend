import { useState, useEffect } from 'react';
import { getToken, removeToken } from '../utils/auth';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { getAllPolls, createPoll, updatePoll, deletePoll } from '../services/api';
import '../styles/basic.css';

function AdminDashboard() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [polls, setPolls] = useState([]);
  const [editingPollId, setEditingPollId] = useState(null);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username || decoded.id);
        if (decoded.role !== 'admin') {
          navigate('/voter');
        }
      } catch (err) {
        removeToken();
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
    fetchPolls();
  }, [navigate]);

  const fetchPolls = async () => {
    try {
      const res = await getAllPolls();
      setPolls(res.data);
    } catch (err) {
      console.error('Failed to fetch polls', err);
      setError('Failed to load polls. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Filter out empty options
    const filteredOptions = options.filter(opt => opt.trim() !== '');

    // Validation
    if (!question.trim()) {
      setError('Question is required');
      return;
    }

    if (filteredOptions.length < 2) {
      setError('Please add at least 2 options');
      return;
    }

    const payload = {
      question: question.trim(),
      options: filteredOptions,
    };

    try {
      if (editingPollId) {
        await updatePoll(editingPollId, payload);
        setSuccess('Poll updated successfully');
      } else {
        await createPoll(payload);
        setSuccess('Poll created successfully');
      }

      // Reset form
      setQuestion('');
      setOptions(['', '']);
      setEditingPollId(null);
      
      // Refresh polls
      await fetchPolls();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Failed to submit poll', err);
      setError(err.response?.data?.message || 'Failed to submit poll. Please try again.');
    }
  };

  const handleEdit = (poll) => {
    setQuestion(poll.question);
    setOptions(poll.options.map(o => o.text));
    setEditingPollId(poll._id);
    setError('');
    setSuccess('');
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this poll?')) return;

    try {
      await deletePoll(id);
      setSuccess('Poll deleted successfully');
      await fetchPolls();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Failed to delete poll', err);
      setError('Failed to delete poll. Please try again.');
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    } else {
      setError('Maximum 10 options allowed');
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = [...options];
      newOptions.splice(index, 1);
      setOptions(newOptions);
    } else {
      setError('Minimum 2 options required');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="header-section">
        <h2>Admin Dashboard</h2>
        <div className="user-info">
          <p>Welcome, {username}</p>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="poll-form">
        <h3>{editingPollId ? 'Edit Poll' : 'Create New Poll'}</h3>
        
        <div className="form-group">
          <label>Question:</label>
          <input
            type="text"
            placeholder="Enter your poll question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Options:</label>
          {options.map((opt, index) => (
            <div key={index} className="option-input">
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                value={opt}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[index] = e.target.value;
                  setOptions(newOptions);
                }}
                required={index < 2}
              />
              {options.length > 2 && (
                <button 
                  type="button" 
                  onClick={() => removeOption(index)}
                  className="remove-option-btn"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          
          <div className="option-buttons">
            <button 
              type="button" 
              onClick={addOption}
              disabled={options.length >= 10}
            >
              Add Option
            </button>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {editingPollId ? 'Update Poll' : 'Create Poll'}
          </button>
          {editingPollId && (
            <button 
              type="button" 
              onClick={() => {
                setEditingPollId(null);
                setQuestion('');
                setOptions(['', '']);
              }}
              className="cancel-btn"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3>Existing Polls</h3>
      {Array.isArray(polls) && polls.length > 0 ? (
        polls.map((poll) => (
          <div key={poll._id} className="poll-card">
            <p><strong>{poll.question}</strong></p>
            <ul>
              {poll.options.map((opt, i) => (
                <li key={i}>
                  {opt.text} — {opt.votes} vote{opt.votes !== 1 ? 's' : ''}
                </li>
              ))}
            </ul>
            <div className="poll-actions">
              <button onClick={() => handleEdit(poll)} className="edit-btn">
                Edit
              </button>
              <button 
                onClick={() => handleDelete(poll._id)} 
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No polls available</p>
      )}
    </div>
  );
}

export default AdminDashboard;