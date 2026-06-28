import { useState } from "react";

const EMPTY_FORM = {
  title: "",
  description: "",
  type: "movie",
  genres: "",
  language: "English",
  releaseYear: new Date().getFullYear(),
  rating: 7.5,
  ageRating: "U/A 13+",
  durationMinutes: 120,
  posterUrl: "",
  bannerUrl: "",
  videoUrl: "",
  cast: "",
  director: "",
  category: "",
  isFeatured: false,
  isTrending: false,
};

// Converts a content document from the API (arrays) into form field strings
const toFormState = (item) => {
  if (!item) return EMPTY_FORM;
  return {
    ...EMPTY_FORM,
    ...item,
    genres: item.genres?.join(", ") || "",
    cast: item.cast?.join(", ") || "",
  };
};

const ContentFormModal = ({ initialData, onSave, onClose }) => {
  const [form, setForm] = useState(toFormState(initialData));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.description || !form.posterUrl || !form.videoUrl) {
      setError("Title, description, poster URL, and video URL are required.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        genres: form.genres.split(",").map((g) => g.trim()).filter(Boolean),
        cast: form.cast.split(",").map((c) => c.trim()).filter(Boolean),
        releaseYear: Number(form.releaseYear) || undefined,
        rating: Number(form.rating) || 0,
        durationMinutes: Number(form.durationMinutes) || 0,
      };
      await onSave(payload);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save content");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pp-modal-backdrop" onClick={onClose}>
      <div className="pp-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{initialData ? "Edit Title" : "Add New Title"}</h2>

        {error && <div className="pp-auth-error">{error}</div>}

        <form className="pp-admin-form" onSubmit={handleSubmit}>
          <label className="pp-form-full">
            Title
            <input name="title" value={form.title} onChange={handleChange} required />
          </label>

          <label className="pp-form-full">
            Description
            <textarea name="description" value={form.description} onChange={handleChange} required />
          </label>

          <label>
            Type
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="movie">Movie</option>
              <option value="show">Show</option>
              <option value="sports">Sports</option>
            </select>
          </label>

          <label>
            Category (home row label)
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="e.g. Trending Now"
            />
          </label>

          <label>
            Genres (comma separated)
            <input name="genres" value={form.genres} onChange={handleChange} placeholder="Action, Thriller" />
          </label>

          <label>
            Language
            <input name="language" value={form.language} onChange={handleChange} />
          </label>

          <label>
            Release Year
            <input type="number" name="releaseYear" value={form.releaseYear} onChange={handleChange} />
          </label>

          <label>
            Rating (0-10)
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              name="rating"
              value={form.rating}
              onChange={handleChange}
            />
          </label>

          <label>
            Age Rating
            <input name="ageRating" value={form.ageRating} onChange={handleChange} placeholder="U/A 13+" />
          </label>

          <label>
            Duration (minutes)
            <input
              type="number"
              name="durationMinutes"
              value={form.durationMinutes}
              onChange={handleChange}
            />
          </label>

          <label className="pp-form-full">
            Poster Image URL
            <input name="posterUrl" value={form.posterUrl} onChange={handleChange} required />
          </label>

          <label className="pp-form-full">
            Banner Image URL (used on hero/detail page)
            <input name="bannerUrl" value={form.bannerUrl} onChange={handleChange} />
          </label>

          <label className="pp-form-full">
            Video URL (mp4)
            <input name="videoUrl" value={form.videoUrl} onChange={handleChange} required />
          </label>

          <label className="pp-form-full">
            Cast (comma separated)
            <input name="cast" value={form.cast} onChange={handleChange} />
          </label>

          <label>
            Director
            <input name="director" value={form.director} onChange={handleChange} />
          </label>

          <div className="pp-form-full pp-checkbox-row">
            <label>
              <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />
              Featured (eligible for hero banner)
            </label>
            <label>
              <input type="checkbox" name="isTrending" checked={form.isTrending} onChange={handleChange} />
              Trending
            </label>
          </div>

          <div className="pp-modal-footer">
            <button type="button" className="pp-btn pp-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="pp-btn pp-btn-primary" disabled={saving}>
              {saving ? "Saving..." : initialData ? "Save Changes" : "Create Title"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContentFormModal;
