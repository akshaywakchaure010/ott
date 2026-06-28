import { useEffect, useState, useCallback } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import Loader from "../../components/ui/Loader";
import { getContentList, createContent, updateContent, deleteContent } from "../../api/content";
import ContentFormModal from "../../components/admin/ContentFormModal";

const ContentManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getContentList({ limit: 200 });
      setItems(data.items);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load content");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreateModal = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    if (editingItem) {
      const { data } = await updateContent(editingItem._id, formData);
      setItems((prev) => prev.map((i) => (i._id === data.content._id ? data.content : i)));
    } else {
      const { data } = await createContent(formData);
      setItems((prev) => [data.content, ...prev]);
    }
    setModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this title? This cannot be undone.")) return;
    try {
      await deleteContent(id);
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete content");
    }
  };

  const filtered = items.filter((i) => i.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <h1>Manage Content</h1>
      <p className="pp-admin-page-sub">Add, edit, or remove movies, shows, and sports clips.</p>

      <div className="pp-admin-toolbar">
        <input
          className="pp-admin-search"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="pp-btn pp-btn-primary" onClick={openCreateModal}>
          <FiPlus /> Add Title
        </button>
      </div>

      {error && <div className="pp-auth-error">{error}</div>}

      {loading ? (
        <Loader />
      ) : (
        <div className="pp-admin-panel">
          <div className="pp-admin-table-wrap">
            <table className="pp-admin-table">
              <thead>
                <tr>
                  <th>Poster</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Genres</th>
                  <th>Year</th>
                  <th>Views</th>
                  <th>Flags</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item._id}>
                    <td><img className="pp-table-thumb" src={item.posterUrl} alt={item.title} /></td>
                    <td>{item.title}</td>
                    <td style={{ textTransform: "capitalize" }}>{item.type}</td>
                    <td>{item.genres?.join(", ")}</td>
                    <td>{item.releaseYear}</td>
                    <td>{item.views}</td>
                    <td>
                      {item.isFeatured && <span className="pp-badge admin">Featured</span>}{" "}
                      {item.isTrending && <span className="pp-badge user">Trending</span>}
                    </td>
                    <td>
                      <div className="pp-table-actions">
                        <button className="pp-icon-btn" onClick={() => openEditModal(item)} aria-label="Edit">
                          <FiEdit2 />
                        </button>
                        <button
                          className="pp-icon-btn danger"
                          onClick={() => handleDelete(item._id)}
                          aria-label="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "32px 0" }}>
                      No content found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalOpen && (
        <ContentFormModal
          initialData={editingItem}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
};

export default ContentManager;
