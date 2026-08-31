import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// ==========================================
// PUBLIC PAGES
// ==========================================

import Home from "./pages/Home";
import Temples from "./pages/Temples";
import TempleDetails from "./pages/TempleDetails";
import DarshanSlots from "./pages/DarshanSlots";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// ==========================================
// USER PAGES
// ==========================================

import MyBookings from "./pages/MyBookings";
import MyDonations from "./pages/MyDonations";
import BookDarshan from "./pages/BookDarshan";
import Donation from "./pages/Donation";
import Profile from "./pages/Profile";

// ==========================================
// ADMIN PAGES
// ==========================================

import AdminDashboard from "./pages/AdminDashboard";
import AdminTemples from "./pages/AdminTemples";
import AdminDarshanSlots from "./pages/AdminDarshanSlots";
import AdminBookings from "./pages/AdminBookings";
import AdminDonations from "./pages/AdminDonations";

// ==========================================
// GLOBAL CSS
// ==========================================

import "./App.css";
import "./pages/Home.css";


// ==========================================
// APP
// ==========================================

function App() {
  return (
    <BrowserRouter>

      {/* ======================================
          NAVBAR
          ====================================== */}

      <Navbar />


      {/* ======================================
          MAIN CONTENT
          ====================================== */}

      <main>

        <Routes>

          {/* ==================================
              PUBLIC ROUTES
              ================================== */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/temples"
            element={<Temples />}
          />

          <Route
            path="/temples/:id"
            element={<TempleDetails />}
          />

          <Route
            path="/darshan-slots"
            element={<DarshanSlots />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* ==================================
              FORGOT PASSWORD
              ================================== */}

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          {/* ==================================
              RESET PASSWORD
              ================================== */}

          <Route
            path="/reset-password/:token"
            element={<ResetPassword />}
          />


          {/* ==================================
              PROTECTED USER ROUTES
              ================================== */}

          <Route element={<ProtectedRoute />}>

            <Route
              path="/book-darshan"
              element={<BookDarshan />}
            />

            <Route
              path="/donation"
              element={<Donation />}
            />

            <Route
              path="/my-bookings"
              element={<MyBookings />}
            />

            <Route
              path="/my-donations"
              element={<MyDonations />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />

          </Route>


          {/* ==================================
              PROTECTED ADMIN ROUTES
              ================================== */}

          <Route element={<AdminRoute />}>

            <Route
              path="/admin"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/temples"
              element={<AdminTemples />}
            />

            <Route
              path="/admin/darshan-slots"
              element={<AdminDarshanSlots />}
            />

            <Route
              path="/admin/bookings"
              element={<AdminBookings />}
            />

            <Route
              path="/admin/donations"
              element={<AdminDonations />}
            />

          </Route>

        </Routes>

      </main>

    </BrowserRouter>
  );
}

export default App;