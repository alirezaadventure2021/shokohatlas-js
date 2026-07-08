import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../axios-client";
import { FiArrowLeft, FiTrash2, FiUser, FiMail, FiCalendar } from "react-icons/fi";

export default function MessageView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    fetchMessage();
  }, [id]);

  const fetchMessage = () => {
    setLoading(true);
    axiosClient
      .get(`/messages/${id}`)
      .then(({ data }) => {
        setMessage(data);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load message");
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = () => {
    axiosClient
      .delete(`/messages/${id}`)
      .then(() => {
        navigate("/messages");
      })
      .catch(() => {
        setShowDelete(false);
      });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <button
          onClick={() => navigate("/messages")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <FiArrowLeft size={18} />
          Back to Messages
        </button>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/messages")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft size={18} />
          Back to Messages
        </button>
        <button
          onClick={() => setShowDelete(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium flex items-center gap-2"
        >
          <FiTrash2 size={16} />
          Delete
        </button>
      </div>

      {/* Message Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* User Info */}
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Sender Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <FiUser size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Name</p>
                <p className="text-sm font-medium text-gray-900">
                  {message.full_name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <FiMail size={18} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-900">
                  {message.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <FiCalendar size={18} className="text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(message.created_at)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Message Content */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Message</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {message.message}
            </p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Message
            </h3>
            <p className="text-gray-500 mb-6 text-sm">
              Are you sure you want to delete this message from{" "}
              <span className="font-medium text-gray-700">
                {message.full_name}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDelete(false)}
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
