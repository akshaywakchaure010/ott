import { useEffect, useState, useCallback } from "react";
import Layout from "../components/layout/Layout";
import Loader from "../components/ui/Loader";
import ContentRow from "../components/cards/ContentRow";
import { getContentList } from "../api/content";
import { getWatchlist, addToWatchlist, removeFromWatchlist } from "../api/watchlist";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/browse.css";
import "../styles/categories.css";

const GENRE_GRADIENTS = [
  "linear-gradient(135deg, #ff2d78, #a23dff)",
  "linear-gradient(135deg, #a23dff, #2d8bff)",
  "linear-gradient(135deg, #2d8bff, #2dd881)",
  "linear-gradient(135deg, #ffb020, #ff2d78)",
  "linear-gradient(135deg, #ff4d6a, #a23dff)",
  "linear-gradient(135deg, #2dd881, #2d8bff)",
];

const Categories = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [watchlistIds, setWatchlistIds] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getContentList({ limit: 200 });
      setItems(data.items);
    } catch (err) {
      console.error("Failed to load categories:", err);
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

  const genres = [...new Set(items.flatMap((i) => i.genres))].sort();
  const itemsForGenre = selectedGenre ? items.filter((i) => i.genres.includes(selectedGenre)) : [];

  return (
    <Layout>
      <div className="pp-browse-header">
        <h1>Browse by Category</h1>
        <p className="pp-categories-sub">Pick a genre to explore everything we've got in it.</p>
      </div>

      {loading ? (
        <Loader />
      ) : selectedGenre ? (
        <div className="pp-rows-wrap-static">
          <button className="pp-back-link" onClick={() => setSelectedGenre(null)}>
            ← All Categories
          </button>
          <ContentRow
            title={selectedGenre}
            items={itemsForGenre}
            watchlistIds={watchlistIds}
            onToggleWatchlist={handleToggleWatchlist}
          />
        </div>
      ) : (
        <div className="pp-category-grid">
          {genres.map((genre, i) => (
            <button
              key={genre}
              className="pp-category-tile"
              style={{ background: GENRE_GRADIENTS[i % GENRE_GRADIENTS.length] }}
              onClick={() => setSelectedGenre(genre)}
            >
              {genre}
            </button>
          ))}
          {genres.length === 0 && (
            <div className="pp-empty-state">
              <h3>No categories yet</h3>
              <p>Add some content with genres from the Admin Dashboard.</p>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Categories;
