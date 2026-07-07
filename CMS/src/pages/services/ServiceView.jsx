import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../axios-client";
import { FiEdit2 } from "react-icons/fi";
import { getLocalized } from "../../utils/parseField";

export default function ServiceView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get(`/services/${id}`)
      .then(({ data }) => setService(data))
      .catch(() => navigate("/services"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${import.meta.env.VITE_API_BASE_URL + path}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!service) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Service Details</h1>
        <div className="flex gap-3">
          <Link
            to={`/services/${id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
          >
            <FiEdit2 size={14} /> Edit
          </Link>
          <Link
            to="/services"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {["en", "fa", "ru"].map((lang) => (
            <div
              key={lang}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
                {lang === "en"
                  ? "English"
                  : lang === "fa"
                    ? "فارسی"
                    : "Русский"}
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-gray-400">Title</span>
                  <p className="text-gray-900">
                    {getLocalized(service.title, lang) || "—"}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Slug</span>
                  <p className="text-gray-900 font-mono text-sm">
                    {getLocalized(service.slug, lang) || "—"}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Description</span>
                  <p className="text-gray-700 text-sm">
                    {getLocalized(service.description, lang) || "—"}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Article</span>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">
                    {getLocalized(service.article, lang) || "—"}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Meta Title</span>
                  <p className="text-gray-700 text-sm">
                    {getLocalized(service.meta_title, lang) || "—"}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">
                    Meta Description
                  </span>
                  <p className="text-gray-700 text-sm">
                    {getLocalized(service.meta_description, lang) || "—"}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Canonical</span>
                  <p className="text-gray-700 text-sm">
                    {getLocalized(service.canonical, lang) || "—"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
              Status
            </h3>
            <span
              className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${service.status === 1 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}
            >
              {service.status === 1 ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
              Card Image
            </h3>
            {service.card_image ? (
              <img
                src={getImageUrl(service.card_image)}
                alt=""
                className="w-full rounded-lg object-cover"
              />
            ) : (
              <p className="text-gray-400 text-sm">No image</p>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
              Page Image
            </h3>
            {service.page_image ? (
              <img
                src={getImageUrl(service.page_image)}
                alt=""
                className="w-full rounded-lg object-cover"
              />
            ) : (
              <p className="text-gray-400 text-sm">No image</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
