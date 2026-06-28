import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlay, FiInfo, FiPlus, FiCheck } from "react-icons/fi";
import Layout from "../components/layout/Layout";
import ContentRow from "../components/cards/ContentRow";
import Loader from "../components/ui/Loader";
import { getHomeRows } from "../api/content";
import { getWatchlist, addToWatchlist, removeFromWatchlist, getContinueWatching } from "../api/watchlist";
import { useAuth } from "../context/AuthContext";
import "../styles/home.css";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [hero, setHero] = useState(null);
  const [watchlistIds, setWatchlistIds] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHome = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getHomeRows();
      setRows(data.rows);

      // Pick a featured item for the hero banner from the first row
      const firstWithBanner = data.rows
        .flatMap((r) => r.items)
        .find((item) => item.isFeatured) || data.rows[0]?.items?.[0];
      setHero(firstWithBanner || null);
    } catch (err) {
      console.error("Failed to load home content:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadUserData = useCallback(async () => {
    if (!isAuthenticated) {
      setWatchlistIds([]);
      setContinueWatching([]);
      return;
    }
    try {
      const [wl, cw] = await Promise.all([getWatchlist(), getContinueWatching()]);
      setWatchlistIds(wl.data.watchlist.map((c) => c._id));
      setContinueWatching(cw.data.continueWatching);
    } catch (err) {
      console.error("Failed to load user data:", err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadHome();
  }, [loadHome]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleToggleWatchlist = async (contentId) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      if (watchlistIds.includes(contentId)) {
        await removeFromWatchlist(contentId);
        setWatchlistIds((prev) => prev.filter((id) => id !== contentId));
      } else {
        await addToWatchlist(contentId);
        setWatchlistIds((prev) => [...prev, contentId]);
      }
    } catch (err) {
      console.error("Failed to update watchlist:", err);
    }
  };

  const continueRow = continueWatching.length
    ? {
        title: "Continue Watching",
        items: continueWatching.map((cw) => cw.content),
      }
    : null;

  const progressMap = continueWatching.reduce((acc, cw) => {
    if (cw.durationSeconds > 0) {
      acc[cw.content._id] = Math.min(100, (cw.progressSeconds / cw.durationSeconds) * 100);
    }
    return acc;
  }, {});

  if (loading) {
    return (
      <Layout>
        <Loader fullScreen />
      </Layout>
    );
  }

  return (
    <Layout>
      {hero && (
        <div className="pp-hero" style={{ backgroundImage: `url(${hero.bannerUrl || hero.posterUrl})` }}>
          <div className="pp-hero-fade" />
          <div className="pp-hero-content">
            <p className="pp-hero-eyebrow">{hero.type === "movie" ? "Featured Movie" : "Featured"}</p>
            <h1 className="pp-hero-title">{hero.title}</h1>
            <div className="pp-hero-meta">
              {hero.releaseYear && <span>{hero.releaseYear}</span>}
              {hero.ageRating && <span className="pp-pill">{hero.ageRating}</span>}
              {hero.genres?.slice(0, 3).map((g) => <span key={g}>{g}</span>)}
            </div>
            <p className="pp-hero-desc">{hero.description}</p>
            <div className="pp-hero-actions">
              <button className="pp-btn pp-btn-primary" onClick={() => navigate(`/title/${hero._id}`)}>
                <FiPlay /> Play
              </button>
              <button className="pp-btn pp-btn-ghost" onClick={() => navigate(`/title/${hero._id}`)}>
                <FiInfo /> More Info
              </button>
              <button className="pp-btn pp-btn-icon" onClick={() => handleToggleWatchlist(hero._id)}>
                {watchlistIds.includes(hero._id) ? <FiCheck /> : <FiPlus />}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pp-rows-wrap">
        {continueRow && (
          <ContentRow
            title={continueRow.title}
            items={continueRow.items}
            watchlistIds={watchlistIds}
            onToggleWatchlist={handleToggleWatchlist}
            progressMap={progressMap}
          />
        )}

        {rows.map((row) => (
          <ContentRow
            key={row.title}
            title={row.title}
            items={row.items}
            watchlistIds={watchlistIds}
            onToggleWatchlist={handleToggleWatchlist}
          />
        ))}

        {rows.length === 0 && !continueRow && (
          <div className="pp-empty-state">
            <h3>No content yet</h3>
            <p>Ask an admin to add some movies, shows, or sports clips from the Admin Dashboard.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Home;
