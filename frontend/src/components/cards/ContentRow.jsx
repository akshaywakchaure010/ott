import { useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ContentCard from "../cards/ContentCard";
import "../../styles/carousel.css";

const ContentRow = ({ title, items, watchlistIds = [], onToggleWatchlist, progressMap }) => {
  const trackRef = useRef(null);

  if (!items || items.length === 0) return null;

  const scroll = (direction) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({
      left: direction === "left" ? -700 : 700,
      behavior: "smooth",
    });
  };

  return (
    <section className="pp-row">
      <h3 className="pp-row-title">{title}</h3>

      <div className="pp-row-wrap">
        <button
          className="pp-row-arrow left"
          onClick={() => scroll("left")}
          aria-label={`Scroll ${title} left`}
        >
          <FiChevronLeft />
        </button>

        <div className="pp-row-track" ref={trackRef}>
          {items.map((item) => (
            <ContentCard
              key={item._id}
              item={item}
              inWatchlist={watchlistIds.includes(item._id)}
              onToggleWatchlist={onToggleWatchlist}
              progressPercent={progressMap?.[item._id]}
            />
          ))}
        </div>

        <button
          className="pp-row-arrow right"
          onClick={() => scroll("right")}
          aria-label={`Scroll ${title} right`}
        >
          <FiChevronRight />
        </button>
      </div>
    </section>
  );
};

export default ContentRow;
