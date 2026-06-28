import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiPlay, FiPlus, FiCheck, FiX, FiStar } from "react-icons/fi";
import Layout from "../components/layout/Layout";
import Loader from "../components/ui/Loader";
import {
  getContentById,
  incrementView,
  getContentList,
} from "../api/content";
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  updateContinueWatching,
} from "../api/watchlist";
import { useAuth } from "../context/AuthContext";
import ContentRow from "../components/cards/ContentRow";
import "../styles/titleDetail.css";

const TitleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [content, setContent] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const videoRef = useRef(null);
  const progressIntervalRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getContentById(id);
      setContent(data.content);

      if (data.content.genres?.length) {
        const similarRes = await getContentList({
          genre: data.content.genres[0],
          type: data.content.type,
          limit: 12,
        });
        setSimilar(similarRes.data.items.filter((i) => i._id !== id));
      }

      if (isAuthenticated) {
        const wl = await getWatchlist();
        setInWatchlist(wl.data.watchlist.some((c) => c._id === id));
      }
    } catch (err) {
      console.error("Failed to load title:", err);
    } finally {
      setLoading(false);
    }
  }, [id, isAuthenticated]);

  useEffect(() => {
    load();
    // Reset player state when navigating between titles
    setIsPlaying(false);
  }, [load]);

  useEffect(() => {
    return () => clearInterval(progressIntervalRef.current);
  }, []);

  const handlePlay = async () => {
    setIsPlaying(true);
    try {
      await incrementView(id);
    } catch (err) {
      console.error("Failed to register view:", err);
    }
  };

  const handleClosePlayer = () => {
    setIsPlaying(false);
    clearInterval(progressIntervalRef.current);
    saveProgress();
  };

  const saveProgress = async () => {
    if (!isAuthenticated || !videoRef.current) return;
    const { currentTime, duration } = videoRef.current;
    if (!duration) return;
    try {
      await updateContinueWatching(id, {
        progressSeconds: Math.floor(currentTime),
        durationSeconds: Math.floor(duration),
      });
    } catch (err) {
      console.error("Failed to save progress:", err);
    }
  };

  // Periodically save progress while playing
  const handleTimeUpdate = () => {
    if (!progressIntervalRef.current) {
      progressIntervalRef.current = setInterval(saveProgress, 10000);
    }
  };

  const handleToggleWatchlist = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      if (inWatchlist) {
        await removeFromWatchlist(id);
        setInWatchlist(false);
      } else {
        await addToWatchlist(id);
        setInWatchlist(true);
      }
    } catch (err) {
      console.error("Failed to update watchlist:", err);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Loader fullScreen />
      </Layout>
    );
  }

  if (!content) {
    return (
      <Layout>
        <div className="pp-empty-state">
          <h3>Title not found</h3>
          <p>This title may have been removed. Try browsing for something else.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {isPlaying ? (
        <div className="pp-player-overlay">
          <button className="pp-player-close" onClick={handleClosePlayer} aria-label="Close player">
            <FiX />
          </button>
          <video
            ref={videoRef}
            src={content.videoUrl}
            controls
            autoPlay
            className="pp-player-video"
            onTimeUpdate={handleTimeUpdate}
            onPause={saveProgress}
          />
        </div>
      ) : (
        <>
          <div
            className="pp-detail-banner"
            style={{ backgroundImage: `url(${content.bannerUrl || content.posterUrl})` }}
          >
            <div className="pp-detail-fade" />
          </div>

          <div className="pp-detail-content">
            <h1>{content.title}</h1>

            <div className="pp-detail-meta">
              {content.rating > 0 && (
                <span className="pp-rating">
                  <FiStar /> {content.rating.toFixed(1)}
                </span>
              )}
              {content.releaseYear && <span>{content.releaseYear}</span>}
              {content.ageRating && <span className="pp-pill">{content.ageRating}</span>}
              {content.durationMinutes > 0 && <span>{content.durationMinutes} min</span>}
              {content.language && <span>{content.language}</span>}
            </div>

            <div className="pp-detail-genres">
              {content.genres?.map((g) => (
                <span key={g} className="pp-genre-tag">{g}</span>
              ))}
            </div>

            <div className="pp-detail-actions">
              <button className="pp-btn pp-btn-primary" onClick={handlePlay}>
                <FiPlay /> Play
              </button>
              <button className="pp-btn pp-btn-ghost" onClick={handleToggleWatchlist}>
                {inWatchlist ? <FiCheck /> : <FiPlus />}
                {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
              </button>
            </div>

            <p className="pp-detail-desc">{content.description}</p>

            {content.cast?.length > 0 && (
              <p className="pp-detail-cast">
                <strong>Cast: </strong>
                {content.cast.join(", ")}
              </p>
            )}
            {content.director && (
              <p className="pp-detail-cast">
                <strong>Director: </strong>
                {content.director}
              </p>
            )}
          </div>

          {similar.length > 0 && (
            <div className="pp-rows-wrap-static">
              <ContentRow title="More Like This" items={similar} />
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default TitleDetail;
