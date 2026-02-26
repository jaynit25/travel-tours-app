import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomerLayout from "./layouts/CustomerLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import TourDetails from "./pages/TourDetails";
import MyBookings from "./pages/MyBookings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Maintenance from "./pages/Maintenance";
import AdminDashboard from "./pages/AdminDashboard";
import ManageTours from "./pages/ManageTours";
import ManageBookings from "./pages/ManageBookings";
import ManageUsers from "./pages/ManageUsers";
import ManageReviews from "./pages/ManageReviews";
import ManageInquiry from "./pages/ManageInquiry";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer Routes */}
        <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
        <Route path="/mybookings" element={<CustomerLayout><MyBookings /></CustomerLayout>} />
        <Route path="/profile" element={<CustomerLayout><Profile /></CustomerLayout>} />
        
        {/* FIXED PATH: Matches TourCard and MyBookings links */}
        <Route path="/tours/:id" element={<CustomerLayout><TourDetails /></CustomerLayout>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute roleRequired="admin"><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/tours" element={<ProtectedRoute roleRequired="admin"><AdminLayout><ManageTours /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/bookings" element={<ProtectedRoute roleRequired="admin"><AdminLayout><ManageBookings /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute roleRequired="admin"><AdminLayout><ManageUsers /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/reviews" element={<ProtectedRoute roleRequired="admin"><AdminLayout><ManageReviews /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/inquiries" element={<ProtectedRoute roleRequired="admin"><AdminLayout><ManageInquiry /></AdminLayout></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}