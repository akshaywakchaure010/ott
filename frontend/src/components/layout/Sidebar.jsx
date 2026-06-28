import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiSearch,
  FiTv,
  FiFilm,
  FiUser,
  FiGrid,
  FiVideo,
} from "react-icons/fi";
import { MdSportsCricket } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo-full.png";
import "../../styles/sidebar.css";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: FiHome },
  { to: "/explore", label: "Search", icon: FiSearch },
  { to: "/shows", label: "Shows", icon: FiTv },
  { to: "/movies", label: "Movies", icon: FiFilm },
  { to: "/sports", label: "Sports", icon: MdSportsCricket },
  { to: "/creator", label: "Creators", icon: FiVideo },
  { to: "/categories", label: "Categories", icon: FiGrid },
];

const Sidebar = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="pp-sidebar">
      <div
        className="pp-sidebar-logo"
        
        role="button"
        tabIndex={0}
        aria-label="Go to home"
      >
        <img src={logo} alt="Pixel Play" />
      </div>

      <ul className="pp-sidebar-links">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) => `pp-sidebar-link${isActive ? " active" : ""}`}
            >
              <Icon className="nav-icon" size={20} />
              {/* <span>{label}</span> */}
            </NavLink>
          </li>
          
        ))}
        <li>
            <NavLink
          to={isAuthenticated ? "/myspace" : "/login"}
          className={({ isActive }) => `pp-sidebar-link${isActive ? " active" : ""}`}
        >
          {user?.avatar ? (
            <img className="pp-sidebar-avatar" src={user.avatar} alt={user.name} />
          ) : (
            <FiUser className="nav-icon" size={20} />
          )}
          {/* <span>{isAuthenticated ?  <FiUser size={20} /> : "Sign In"}</span> */}
        </NavLink>
          </li>
      </ul>

      
    </nav>
  );
};

export default Sidebar;
