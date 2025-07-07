// src/pages/VoterDashboard.jsx

import { useEffect, useState } from 'react';
import { getToken, removeToken } from '../utils/auth';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { getAllPolls, voteOnPoll } from '../services/api';
import '../styles/basic.css';

function VoterDashboard() {
  const [username, setUsername] = useState('');
  const [polls, setPolls] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (token) {
      const decoded = jwtDecode(token);
      setUsername(decoded.id);
    }
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const res = await getAllPolls();
      setPolls(res.data);
    } catch (err) {
      console.error('Failed to fetch polls', err);
    }
  };

  const handleVote = async (pollId, optionIndex) => {
    if (optionIndex === undefined) {
      return alert('Please select an option to vote.');
    }
    try {
      await voteOnPoll({ pollId, optionIndex });
      alert('Vote submitted successfully!');
      fetchPolls(); // Refresh polls to show updated vote counts
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit vote');
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <h2>Voter Dashboard</h2>
      <p>Welcome, Voter (User ID: {username})</p>
      <button onClick={handleLogout} className="logout-btn">Logout</button>

      <h3 style={{ marginTop: '2rem', borderTop: '1px solid #444', paddingTop: '1.5rem' }}>
        Available Polls
      </h3>

      {Array.isArray(polls) && polls.length > 0 ? (
        polls.map((poll) => (
          <div key={poll._id} className="poll-card">
            <p><strong>{poll.question}</strong></p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleVote(poll._id, selectedOptions[poll._id]);
              }}
            >
              {poll.options.map((opt, index) => (
                <div key={index} style={{ margin: '0.5rem 0', textAlign: 'left' }}>
                  <input
                    type="radio"
                    id={`poll-${poll._id}-option-${index}`}
                    name={`poll-${poll._id}`}
                    value={index}
                    onChange={() =>
                      setSelectedOptions((prev) => ({
                        ...prev,
                        [poll._id]: index,
                      }))
                    }
                    style={{ width: 'auto', marginRight: '10px' }}
                  />
                  <label htmlFor={`poll-${poll._id}-option-${index}`}>
                    {opt.text} — {opt.votes} votes
                  </label>
                </div>
              ))}
              <button type="submit" className="vote-btn" style={{ backgroundColor: '#007bff', color: 'white' }}>
                Vote
              </button>
            </form>
          </div>
        ))
      ) : (
        <p>No polls are available at the moment.</p>
      )}
    </div>
  );
}

export default VoterDashboard;