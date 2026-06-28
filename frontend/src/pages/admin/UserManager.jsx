import { useEffect, useState, useCallback } from "react";
import { FiTrash2, FiShield, FiUserCheck, FiUserX } from "react-icons/fi";
import Loader from "../../components/ui/Loader";
import { useAuth } from "../../context/AuthContext";
import { getAllUsers, updateUserRole, updateUserStatus, deleteUser } from "../../api/admin";

const UserManager = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getAllUsers();
      setUsers(data.users);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleToggleRole = async (u) => {
    const newRole = u.role === "admin" ? "user" : "admin";
    if (!window.confirm(`${newRole === "admin" ? "Promote" : "Demote"} ${u.name} to ${newRole}?`)) return;
    try {
      const { data } = await updateUserRole(u.id, newRole);
      setUsers((prev) => prev.map((x) => (x.id === u.id ? data.user : x)));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update role");
    }
  };

  const handleToggleStatus = async (u) => {
    try {
      const { data } = await updateUserStatus(u.id, !u.isActive);
      setUsers((prev) => prev.map((x) => (x.id === u.id ? data.user : x)));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (u) => {
    if (!window.confirm(`Delete ${u.name}'s account? This cannot be undone.`)) return;
    try {
      await deleteUser(u.id);
      setUsers((prev) => prev.filter((x) => x.id !== u.id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <h1>Manage Users</h1>
      <p className="pp-admin-page-sub">View, promote, deactivate, or remove viewer accounts.</p>

      <div className="pp-admin-toolbar">
        <input
          className="pp-admin-search"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <div className="pp-auth-error">{error}</div>}

      {loading ? (
        <Loader />
      ) : (
        <div className="pp-admin-panel">
          <div className="pp-admin-table-wrap">
            <table className="pp-admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => {
                  const isSelf = u.id === currentUser?.id;
                  return (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td><span className={`pp-badge ${u.role}`}>{u.role}</span></td>
                      <td>
                        <span className={`pp-badge ${u.isActive === false ? "inactive" : "active"}`}>
                          {u.isActive === false ? "Deactivated" : "Active"}
                        </span>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="pp-table-actions">
                          <button
                            className="pp-icon-btn"
                            title={u.role === "admin" ? "Demote to user" : "Promote to admin"}
                            onClick={() => handleToggleRole(u)}
                            disabled={isSelf}
                          >
                            <FiShield />
                          </button>
                          <button
                            className="pp-icon-btn"
                            title={u.isActive === false ? "Activate" : "Deactivate"}
                            onClick={() => handleToggleStatus(u)}
                            disabled={isSelf}
                          >
                            {u.isActive === false ? <FiUserCheck /> : <FiUserX />}
                          </button>
                          <button
                            className="pp-icon-btn danger"
                            title="Delete account"
                            onClick={() => handleDelete(u)}
                            disabled={isSelf}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "32px 0" }}>
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default UserManager;
