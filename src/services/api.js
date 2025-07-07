import axios from 'axios';
import { getToken } from '../utils/auth';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = (userData) => API.post('/auth/register', userData);
export const loginUser = (userData) => API.post('/auth/login', userData);
export const getAllPolls = () => API.get('/polls');
export const createPoll = (pollData) => API.post('/polls', pollData);
export const updatePoll = (id, pollData) => API.put(`/polls/${id}`, pollData);
export const deletePoll = (id) => API.delete(`/polls/${id}`);

// ADD THIS NEW EXPORT
export const voteOnPoll = (voteData) => API.post('/polls/vote', voteData);