import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Maintenance from "./pages/Maintenance";

import Home from "./pages/Home";
import MyBookings from "./pages/MyBookings";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import CustomerLayout from "./layouts/CustomerLayout";
import TourDetails from "./pages/TourDetails";
import Register from "./pages/Register"; 


// Admin Pages
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import ManageTours from "./pages/ManageTours";
import ManageBookings from "./pages/ManageBookings";
import ManageUsers from "./pages/ManageUsers";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Maintenance */}
        <Route path="/maintenance" element={<Maintenance />} />
        {/* Public/Customer */}
        <Route path="/login" element={<Login />} />
		    <Route path="/register" element={<Register />} />
        <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
        <Route path="/mybookings" element={<CustomerLayout><MyBookings /></CustomerLayout>} />
        <Route path="/profile" element={<CustomerLayout><Profile /></CustomerLayout>} />
        <Route path="/tour/:id" element={<CustomerLayout><TourDetails /></CustomerLayout>} />


        {/* Admin */}
        <Route path="/admin" element={
          <ProtectedRoute roleRequired="admin">
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin/tours" element={
          <ProtectedRoute roleRequired="admin">
            <AdminLayout>
              <ManageTours />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin/bookings" element={
          <ProtectedRoute roleRequired="admin">
          <AdminLayout>
            <ManageBookings />
          </AdminLayout>
          </ProtectedRoute>
        } />

      <Route path="/admin/users" element={
        <ProtectedRoute roleRequired="admin">
        <AdminLayout>
          <ManageUsers />
        </AdminLayout>
        </ProtectedRoute>
      } />

      </Routes>
    </BrowserRouter>
  );
}
