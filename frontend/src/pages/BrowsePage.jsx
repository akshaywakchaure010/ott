import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ContentRow from "../components/cards/ContentRow";
import Loader from "../components/ui/Loader";
import { getContentList } from "../api/content";
import { getWatchlist, addToWatchlist, removeFromWatchlist } from "../api/watchlist";
import { useAuth } from "../context/AuthContext";
import "../styles/browse.css";

// type: "movie" | "show" | "sports" — drives which content is fetched and
// how it's grouped into genre rows.
const BrowsePage = ({ type, pageTitle }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [watchlistIds, setWatchlistIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeGenre, setActiveGenre] = useState("All");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getContentList({ type, limit: 100 });
      setItems(data.items);
    } catch (err) {
      console.error(`Failed to load ${type} content:`, err);
    } finally {
      setLoading(false);
    }
  }, [type]);

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

  const allGenres = ["All", ...new Set(items.flatMap((i) => i.genres))];
  const filteredItems = activeGenre === "All" ? items : items.filter((i) => i.genres.includes(activeGenre));

  // Group filtered items by their first genre to build rows
  const rows = allGenres
    .filter((g) => g !== "All")
    .map((genre) => ({
      title: genre,
      items: filteredItems.filter((i) => i.genres[0] === genre),
    }))
    .filter((row) => row.items.length > 0);

  return (
    <Layout>
      <div className="pp-browse-header">
        <h1>{pageTitle}</h1>

        <div className="pp-genre-filters">
          {allGenres.map((genre) => (
            <button
              key={genre}
              className={`pp-genre-chip${activeGenre === genre ? " active" : ""}`}
              onClick={() => setActiveGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : rows.length === 0 ? (
        <div className="pp-empty-state">
          <h3>Nothing here yet</h3>
          <p>Check back soon, or browse a different category.</p>
        </div>
      ) : (
        <div className="pp-rows-wrap-static">
          {rows.map((row) => (
            <ContentRow
              key={row.title}
              title={row.title}
              items={row.items}
              watchlistIds={watchlistIds}
              onToggleWatchlist={handleToggleWatchlist}
            />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default BrowsePage;
