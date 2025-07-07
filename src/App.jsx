// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

// import all pages
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import VoterDashboard from "./pages/VoterDashboard";
// import Vote from "./pages/Vote"; // REMOVE THIS LINE

// import protected route wrapper
import ProtectedRoute from "./components/ProtectedRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* protected route for admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* protected route for voter */}
        <Route
          path="/voter"
          element={
            <ProtectedRoute role="voter">
              <VoterDashboard />
            </ProtectedRoute>
          }
        />

        {/* REMOVE THE OLD /vote ROUTE */}
        {/* <Route
          path="/vote"
          element={
            <ProtectedRoute role="voter">
              <Vote />
            </ProtectedRoute>
          }
        /> 
        */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;