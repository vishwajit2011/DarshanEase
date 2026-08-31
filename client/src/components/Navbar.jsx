import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  const isAdmin =
    user?.role === "ADMIN";

  const getNavClass = ({
    isActive,
  }) => {
    return isActive
      ? "navbar-link active"
      : "navbar-link";
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* =========================
            BRAND
        ========================= */}

        <Link
          to="/"
          className="navbar-brand"
        >
          <span className="brand-icon">
            ॐ
          </span>

          <span>
            DarshanEase
          </span>
        </Link>

        <nav className="navbar-links">

          {/* HOME */}

          <NavLink
            to="/"
            end
            className={getNavClass}
          >
            Home
          </NavLink>

          {/* =================================
              TEMPLE - PUBLIC VIEW
              BOTH ADMIN AND USER CAN SEE THIS
          ================================= */}

          <NavLink
            to="/temples"
            end
            className={getNavClass}
          >
            Temples
          </NavLink>

          {/* =================================
              DARSHAN SLOTS - PUBLIC VIEW
              BOTH ADMIN AND USER CAN SEE THIS
          ================================= */}

          <NavLink
            to="/darshan-slots"
            end
            className={getNavClass}
          >
            Darshan Slots
          </NavLink>

          {/* =================================
              ADMIN NAVIGATION
          ================================= */}

          {isAdmin && (
            <>
              <NavLink
                to="/admin"
                end
                className={getNavClass}
              >
                Admin Dashboard
              </NavLink>

              <NavLink
                to="/admin/temples"
                end
                className={getNavClass}
              >
                Temple Management
              </NavLink>

              <NavLink
                to="/admin/darshan-slots"
                end
                className={getNavClass}
              >
                Slot Management
              </NavLink>

              <NavLink
                to="/admin/bookings"
                end
                className={getNavClass}
              >
                Bookings
              </NavLink>

              <NavLink
                to="/admin/donations"
                end
                className={getNavClass}
              >
                Donations
              </NavLink>
            </>
          )}

          {/* =================================
              NORMAL USER NAVIGATION
          ================================= */}

          {isAuthenticated &&
            !isAdmin && (
              <>
                <NavLink
                  to="/book-darshan"
                  className={getNavClass}
                >
                  Book Darshan
                </NavLink>

                <NavLink
                  to="/donation"
                  className={getNavClass}
                >
                  Donate
                </NavLink>

                <NavLink
                  to="/my-bookings"
                  className={getNavClass}
                >
                  My Bookings
                </NavLink>

                <NavLink
                  to="/my-donations"
                  className={getNavClass}
                >
                  My Donations
                </NavLink>
              </>
            )}

          {/* =================================
              LOGIN / REGISTER
          ================================= */}

          {!isAuthenticated && (
            <>
              <NavLink
                to="/login"
                className="nav-login"
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="nav-register"
              >
                Register
              </NavLink>
            </>
          )}

          {/* =================================
              PROFILE
              LOGGED-IN USERS ONLY
          ================================= */}

          {isAuthenticated && (
            <>
              <NavLink
                to="/profile"
                className={getNavClass}
              >
                Profile
              </NavLink>

              <span className="navbar-user">
                Hi, {user?.name}
              </span>

              <button
                type="button"
                className="navbar-logout"
                onClick={logout}
              >
                Logout
              </button>
            </>
          )}

        </nav>
      </div>
    </header>
  );
}

export default Navbar;