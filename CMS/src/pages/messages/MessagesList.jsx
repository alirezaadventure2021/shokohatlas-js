import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../axios-client";
import { FiMail, FiTrash2, FiSearch } from "react-icons/fi";

export default function MessagesList() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, [activeTab, search]);

  const fetchMessages = () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (activeTab === "unread") params.unread_only = "true";

    axiosClient
      .get("/messages", { params })
      .then(({ data }) => {
        setMessages(data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    axiosClient
      .delete(`/messages/${deleteTarget.id}`)
      .then(() => {
        setDeleteTarget(null);
        fetchMessages();
      })
      .catch(() => {
        setDeleteTarget(null);
      });
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="relative">
          <FiSearch
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === "all"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          All Messages
        </button>
        <button
          onClick={() => setActiveTab("unread")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
            activeTab === "unread"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Unread
          {unreadCount > 0 && (
            <span
              className={`px-1.5 py-0.5 rounded-full text-xs ${
                activeTab === "unread"
                  ? "bg-white text-blue-600"
                  : "bg-red-500 text-white"
              }`}
            >
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
          <FiMail size={48} className="mx-auto mb-3 opacity-50" />
          <p>No messages found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white rounded-xl border overflow-hidden transition ${
                msg.is_read
                  ? "border-gray-200"
                  : "border-blue-300 bg-blue-50/30"
              }`}
            >
              <div className="flex items-center gap-4 p-4">
                {/* Unread indicator */}
                {!msg.is_read && (
                  <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                )}

                {/* Content */}
                <Link
                  to={`/messages/${msg.id}`}
                  className="flex-1 min-w-0"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <p
                      className={`text-sm truncate ${
                        msg.is_read
                          ? "font-normal text-gray-900"
                          : "font-semibold text-gray-900"
                      }`}
                    >
                      {msg.full_name}
                    </p>
                    <span className="text-xs text-gray-400 shrink-0">
                      {formatTime(msg.created_at)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{msg.email}</p>
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {msg.message}
                  </p>
                </Link>

                {/* Delete button */}
                <button
                  onClick={() => setDeleteTarget(msg)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition shrink-0"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Message
            </h3>
            <p className="text-gray-500 mb-6 text-sm">
              Are you sure you want to delete the message from{" "}
              <span className="font-medium text-gray-700">
                {deleteTarget.full_name}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
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
