import { useEffect, useState } from 'react';
import { getToken } from '../utils/auth';
import axios from 'axios';
import '../styles/basic.css';

function Vote() {
  const [polls, setPolls] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const token = getToken();
        const res = await axios.get('http://localhost:5001/api/polls', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPolls(res.data);
      } catch (err) {
        alert('Failed to load polls');
      }
    };

    fetchPolls();
  }, []);

  const handleVote = async (pollId, optionIndex) => {
    try {
      const token = getToken();
      await axios.post(
        'http://localhost:5001/api/polls/vote',
        { pollId, optionIndex },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Vote submitted!');
    } catch (err) {
      alert(err.response?.data?.message || 'Vote failed');
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Available Polls</h2>
      {polls.map((poll) => (
        <div key={poll._id} className="poll-card">
          <p><strong>{poll.question}</strong></p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVote(poll._id, selectedOptions[poll._id]);
            }}
          >
            {poll.options.map((opt, index) => (
              <div key={index}>
                <input
                  type="radio"
                  name={`poll-${poll._id}`}
                  value={index}
                  onChange={() =>
                    setSelectedOptions((prev) => ({
                      ...prev,
                      [poll._id]: index,
                    }))
                  }
                />
                <label>{opt.text}</label>
              </div>
            ))}
            <button type="submit" className="vote-btn">Vote</button>
          </form>
        </div>
      ))}
    </div>
  );
}

export default Vote;