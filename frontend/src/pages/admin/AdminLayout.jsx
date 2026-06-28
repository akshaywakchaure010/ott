import { NavLink, Outlet } from "react-router-dom";
import { FiBarChart2, FiFilm, FiUsers, FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import "../../styles/admin.css";

const AdminLayout = () => {
  return (
    <div className="pp-admin-shell">
      <aside className="pp-admin-sidebar">
        <Link to="/" className="pp-admin-logo">
          <img src={logo} alt="Pixel Play" />
          <span>Admin</span>
        </Link>

        <nav className="pp-admin-nav">
          <NavLink to="/admin" end className={({ isActive }) => `pp-admin-link${isActive ? " active" : ""}`}>
            <FiBarChart2 /> Overview
          </NavLink>
          <NavLink to="/admin/content" className={({ isActive }) => `pp-admin-link${isActive ? " active" : ""}`}>
            <FiFilm /> Content
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => `pp-admin-link${isActive ? " active" : ""}`}>
            <FiUsers /> Users
          </NavLink>
        </nav>

        <Link to="/" className="pp-admin-exit">
          <FiArrowLeft /> Back to site
        </Link>
      </aside>

      <main className="pp-admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
