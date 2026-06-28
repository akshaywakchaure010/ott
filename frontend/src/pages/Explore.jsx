import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiX } from "react-icons/fi";
import Layout from "../components/layout/Layout";
import ContentRow from "../components/cards/ContentRow";
import Loader from "../components/ui/Loader";
import { getContentList } from "../api/content";
import { getWatchlist, addToWatchlist, removeFromWatchlist } from "../api/watchlist";
import { useAuth } from "../context/AuthContext";
import "../styles/explore.css";

const TRENDING_SEARCHES = ["Action", "Comedy", "Sci-Fi", "Cricket", "Drama", "Thriller"];

const Explore = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [watchlistIds, setWatchlistIds] = useState([]);

  // Load a "trending" row for the empty state
  useEffect(() => {
    getContentList({ trending: "true", limit: 20 })
      .then(({ data }) => setTrending(data.items))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setWatchlistIds([]);
      return;
    }
    getWatchlist()
      .then(({ data }) => setWatchlistIds(data.watchlist.map((c) => c._id)))
      .catch((err) => console.error(err));
  }, [isAuthenticated]);

  const runSearch = useCallback(async (term) => {
    if (!term.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await getContentList({ search: term, limit: 50 });
      setResults(data.items);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search-as-you-type
  useEffect(() => {
    const timer = setTimeout(() => runSearch(query), 400);
    return () => clearTimeout(timer);
  }, [query, runSearch]);

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
      <div className="pp-explore-header">
        <div className="pp-search-box">
          <FiSearch className="pp-search-icon" />
          <input
            autoFocus
            type="text"
            placeholder="Search movies, shows, sports..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button className="pp-search-clear" onClick={() => setQuery("")} aria-label="Clear search">
              <FiX />
            </button>
          )}
        </div>

        {!query && (
          <div className="pp-trending-chips">
            {TRENDING_SEARCHES.map((term) => (
              <button key={term} className="pp-genre-chip" onClick={() => setQuery(term)}>
                {term}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <Loader />
      ) : query ? (
        results.length > 0 ? (
          <div className="pp-rows-wrap-static">
            <ContentRow
              title={`Results for "${query}"`}
              items={results}
              watchlistIds={watchlistIds}
              onToggleWatchlist={handleToggleWatchlist}
            />
          </div>
        ) : (
          <div className="pp-empty-state">
            <h3>No matches for "{query}"</h3>
            <p>Try a different title, genre, or keyword.</p>
          </div>
        )
      ) : (
        <div className="pp-rows-wrap-static">
          <ContentRow
            title="Trending in India"
            items={trending}
            watchlistIds={watchlistIds}
            onToggleWatchlist={handleToggleWatchlist}
          />
        </div>
      )}
    </Layout>
  );
};

export default Explore;
