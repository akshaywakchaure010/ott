import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ContentRow from "../components/cards/ContentRow";
import Loader from "../components/ui/Loader";
import { getContentList } from "../api/content";
import { getWatchlist, addToWatchlist, removeFromWatchlist } from "../api/watchlist";
import { useAuth } from "../context/AuthContext";
import "../styles/browse.css";

const Creator = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [trending, setTrending] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [watchlistIds, setWatchlistIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [trendingRes, featuredRes] = await Promise.all([
        getContentList({ trending: "true", limit: 30 }),
        getContentList({ featured: "true", limit: 30 }),
      ]);
      setTrending(trendingRes.data.items);
      setFeatured(featuredRes.data.items);
    } catch (err) {
      console.error("Failed to load creator content:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!isAuthenticated) {
      setWatchlistIds([]);
      return;
    }
    getWatchlist()
      .then(({ data }) => setWatchlistIds(data.watchlist.map((c) => c._id)))
      .catch((err) => console.error(err));
  }, [isAuthenticated]);

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

  return (
    <Layout>
      <div className="pp-browse-header">
        <h1>Creators &amp; Originals</h1>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="pp-rows-wrap-static">
          <ContentRow
            title="Freshly Dropped"
            items={trending}
            watchlistIds={watchlistIds}
            onToggleWatchlist={handleToggleWatchlist}
          />
          <ContentRow
            title="Pixel Play Originals"
            items={featured}
            watchlistIds={watchlistIds}
            onToggleWatchlist={handleToggleWatchlist}
          />
          {trending.length === 0 && featured.length === 0 && (
            <div className="pp-empty-state">
              <h3>No originals yet</h3>
              <p>Mark some titles as trending or featured from the Admin Dashboard.</p>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Creator;
