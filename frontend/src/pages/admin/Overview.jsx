import { useEffect, useState } from "react";
import { getAdminStats } from "../../api/admin";
import Loader from "../../components/ui/Loader";

const Overview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminStats()
      .then(({ data }) => setStats(data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load dashboard stats"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (error) return <div className="pp-empty-state"><p>{error}</p></div>;

  return (
    <>
      <h1>Dashboard Overview</h1>
      <p className="pp-admin-page-sub">A quick snapshot of your Pixel Play catalog and audience.</p>

      <div className="pp-stats-grid">
        <div className="pp-stat-card">
          <div className="pp-stat-label">Total Viewers</div>
          <div className="pp-stat-value">{stats.totalUsers}</div>
        </div>
        <div className="pp-stat-card">
          <div className="pp-stat-label">Admins</div>
          <div className="pp-stat-value">{stats.totalAdmins}</div>
        </div>
        <div className="pp-stat-card">
          <div className="pp-stat-label">Total Titles</div>
          <div className="pp-stat-value">{stats.totalContent}</div>
        </div>
        <div className="pp-stat-card">
          <div className="pp-stat-label">Movies</div>
          <div className="pp-stat-value">{stats.breakdown.movies}</div>
        </div>
        <div className="pp-stat-card">
          <div className="pp-stat-label">Shows</div>
          <div className="pp-stat-value">{stats.breakdown.shows}</div>
        </div>
        <div className="pp-stat-card">
          <div className="pp-stat-label">Sports Clips</div>
          <div className="pp-stat-value">{stats.breakdown.sports}</div>
        </div>
      </div>

      <div className="pp-admin-panel-grid">
        <div className="pp-admin-panel">
          <h3>Most Viewed Titles</h3>
          <table className="pp-admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Views</th>
              </tr>
            </thead>
            <tbody>
              {stats.topViewed.map((item) => (
                <tr key={item._id}>
                  <td>{item.title}</td>
                  <td style={{ textTransform: "capitalize" }}>{item.type}</td>
                  <td>{item.views}</td>
                </tr>
              ))}
              {stats.topViewed.length === 0 && (
                <tr><td colSpan={3}>No views recorded yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pp-admin-panel">
          <h3>Recently Joined</h3>
          <table className="pp-admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentUsers.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className={`pp-badge ${u.role}`}>{u.role}</span></td>
                </tr>
              ))}
              {stats.recentUsers.length === 0 && (
                <tr><td colSpan={3}>No users yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Overview;
