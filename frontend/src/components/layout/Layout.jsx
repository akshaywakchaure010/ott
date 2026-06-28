import Sidebar from "./Sidebar";
import "../../styles/layout.css";

const Layout = ({ children }) => {
  return (
    <div className="pp-app-shell">
      <Sidebar />
      <main className="pp-main">
        {children}
      </main>
    </div>
  );
};

export default Layout;
