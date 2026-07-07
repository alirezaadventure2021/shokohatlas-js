import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../axios-client";
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { getLocalized } from "../../utils/parseField";

export default function BlogsList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = () => {
    setLoading(true);
    axiosClient
      .get("/blogs")
      .then(({ data }) => {
        setBlogs(data.data || data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const onDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    axiosClient
      .delete(`/blogs/${deleteId}`)
      .then(() => {
        setBlogs(blogs.filter((b) => b.id !== deleteId));
        setDeleteId(null);
      })
      .catch(() => {
        setDeleteId(null);
      });
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${import.meta.env.VITE_API_BASE_URL + path}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blogs</h1>
        <Link
          to="/blogs/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          + Add Blog
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Image
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Title
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Published
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {blogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-400">
                    No blogs found
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {blog.card_image ? (
                        <img
                          src={getImageUrl(blog.card_image)}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                          No img
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {getLocalized(blog.title) || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {blog.published_date || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          blog.status === 1 || blog.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {blog.status === 1 || blog.status === "active"
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/blogs/${blog.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <FiEye size={16} />
                        </Link>
                        <Link
                          to={`/blogs/${blog.id}/edit`}
                          className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                        >
                          <FiEdit2 size={16} />
                        </Link>
                        <button
                          onClick={() => onDelete(blog.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Blog
            </h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this blog? This action cannot be
              undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
