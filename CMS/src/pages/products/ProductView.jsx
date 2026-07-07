import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../axios-client";
import { FiEdit2 } from "react-icons/fi";
import { getLocalized } from "../../utils/parseField";

export default function ProductView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch(() => navigate("/products"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `http://localhost:3000/${path}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Product Details</h1>
        <div className="flex gap-3">
          <Link to={`/products/${id}/edit`} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
            <FiEdit2 size={14} /> Edit
          </Link>
          <Link to="/products" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm">
            Back
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {["en", "fa", "ru"].map((lang) => (
            <div key={lang} className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
                {lang === "en" ? "English" : lang === "fa" ? "فارسی" : "Русский"}
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-gray-400">Name</span>
                  <p className="text-gray-900">{getLocalized(product.name, lang) || "—"}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Slug</span>
                  <p className="text-gray-900 font-mono text-sm">{getLocalized(product.slug, lang) || "—"}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Description</span>
                  <p className="text-gray-700 text-sm">{getLocalized(product.description, lang) || "—"}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Article</span>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">{getLocalized(product.article, lang) || "—"}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Meta Title</span>
                  <p className="text-gray-700 text-sm">{getLocalized(product.meta_title, lang) || "—"}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Meta Description</span>
                  <p className="text-gray-700 text-sm">{getLocalized(product.meta_description, lang) || "—"}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Canonical</span>
                  <p className="text-gray-700 text-sm">{getLocalized(product.canonical, lang) || "—"}</p>
                </div>
              </div>
            </div>
          ))}

          {product.properties && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Properties</h3>
              <pre className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 overflow-x-auto">
                {typeof product.properties === "string" ? product.properties : JSON.stringify(product.properties, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Status</h3>
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${product.status === 1 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
              {product.status === 1 ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Photo</h3>
            {product.photo ? (
              <img src={getImageUrl(product.photo)} alt="" className="w-full rounded-lg object-cover" />
            ) : (
              <p className="text-gray-400 text-sm">No photo</p>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Gallery</h3>
            {product.images && product.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {product.images.map((img) => (
                  <img key={img.id} src={getImageUrl(img.path)} alt={img.alt || ""} className="w-full aspect-square rounded-lg object-cover" />
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No gallery images</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
