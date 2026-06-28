import { useNavigate } from "react-router-dom";
import { FiPlay, FiPlus, FiCheck } from "react-icons/fi";
import "../../styles/movieCard.css";

const ContentCard = ({ item, inWatchlist = false, onToggleWatchlist, progressPercent }) => {
  const navigate = useNavigate();

  if (!item) return null;

  const handleOpen = () => navigate(`/title/${item._id}`);

  return (
    <div className="pp-card" onClick={handleOpen}>
      <div className="pp-card-poster" style={{ backgroundImage: `url(${item.posterUrl})` }}>
        <div className="pp-card-overlay">
          <button className="pp-card-play" aria-label={`Play ${item.title}`}>
            <FiPlay />
          </button>
          {onToggleWatchlist && (
            <button
              className="pp-card-add"
              aria-label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
              onClick={(e) => {
                e.stopPropagation();
                onToggleWatchlist(item._id);
              }}
            >
              {inWatchlist ? <FiCheck /> : <FiPlus />}
            </button>
          )}
        </div>

        {typeof progressPercent === "number" && (
          <div className="pp-card-progress-track">
            <div className="pp-card-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        )}

        <div className="pp-card-info">
          <h4>{item.title}</h4>
          <div className="pp-card-meta">
            {item.releaseYear && <span>{item.releaseYear}</span>}
            {item.ageRating && <span className="pp-pill">{item.ageRating}</span>}
            {item.genres?.[0] && <span>{item.genres[0]}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
