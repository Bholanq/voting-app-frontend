// src/components/ProtectedRoutes.jsx

import { Navigate } from 'react-router-dom';
import { getToken } from '../utils/auth';
import { jwtDecode } from 'jwt-decode'; 

function ProtectedRoute({ children, role }) {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwtDecode(token); 
    if (decoded.role !== role) {
      return <Navigate to="/login" />;
    }
    return children;
  } catch (err) {
    return <Navigate to="/login" />;
  }
}

export default ProtectedRoute;
