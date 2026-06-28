import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiSettings, FiUser, FiEdit2 } from "react-icons/fi";
import Layout from "../components/layout/Layout";
import Loader from "../components/ui/Loader";
import ContentRow from "../components/cards/ContentRow";
import { useAuth } from "../context/AuthContext";
import { getWatchlist, removeFromWatchlist, getContinueWatching } from "../api/watchlist";
import "../styles/myspace.css";

const MySpace = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [watchlist, setWatchlist] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [wl, cw] = await Promise.all([getWatchlist(), getContinueWatching()]);
      setWatchlist(wl.data.watchlist);
      setContinueWatching(cw.data.continueWatching);
    } catch (err) {
      console.error("Failed to load profile data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleRemoveFromWatchlist = async (contentId) => {
    try {
      await removeFromWatchlist(contentId);
      setWatchlist((prev) => prev.filter((c) => c._id !== contentId));
    } catch (err) {
      console.error("Failed to remove from watchlist:", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const progressMap = continueWatching.reduce((acc, cw) => {
    if (cw.durationSeconds > 0) {
      acc[cw.content._id] = Math.min(100, (cw.progressSeconds / cw.durationSeconds) * 100);
    }
    return acc;
  }, {});

  return (
    <Layout>
      <div className="pp-profile-header">
        <div className="pp-profile-avatar">
          {user?.avatar ? <img src={user.avatar} alt={user.name} /> : <FiUser size={32} />}
        </div>
        <div>
          <h1>{user?.name}</h1>
          <p>{user?.email}</p>
          <span className="pp-role-badge">{user?.role}</span>
        </div>

        <div className="pp-profile-actions">
          <button className="pp-btn pp-btn-ghost" onClick={() => navigate("/myspace/edit")}>
            <FiEdit2 /> Edit Profile
          </button>
          {isAdmin && (
            <button className="pp-btn pp-btn-ghost" onClick={() => navigate("/admin")}>
              <FiSettings /> Admin Dashboard
            </button>
          )}
          <button className="pp-btn pp-btn-ghost" onClick={handleLogout}>
            <FiLogOut /> Sign Out
          </button>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="pp-rows-wrap-static">
          {continueWatching.length > 0 && (
            <ContentRow
              title="Continue Watching"
              items={continueWatching.map((cw) => cw.content)}
              progressMap={progressMap}
            />
          )}

          {watchlist.length > 0 ? (
            <ContentRow
              title="My Watchlist"
              items={watchlist}
              watchlistIds={watchlist.map((c) => c._id)}
              onToggleWatchlist={handleRemoveFromWatchlist}
            />
          ) : (
            <div className="pp-empty-state">
              <h3>Your watchlist is empty</h3>
              <p>Tap the + icon on any title to save it here for later.</p>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default MySpace;
