import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import { parseJSON } from "../../utils/parseField";
import { uploadImage } from "../../utils/uploadImage";
import RichEditor from "../../components/RichEditor";

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("en");
  const [errors, setErrors] = useState({});

  const emptyLang = { en: "", fa: "", ru: "" };

  const [form, setForm] = useState({
    name: { ...emptyLang },
    slug: { ...emptyLang },
    description: { ...emptyLang },
    article: { ...emptyLang },
    meta_title: { ...emptyLang },
    meta_description: { ...emptyLang },
    canonical: { ...emptyLang },
    status: 1,
    properties: { ...emptyLang },
    photo: null,
    gallery: [],
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
  });
  const [touched, setTouched] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.name.en?.trim()) newErrors.name_en = "Name is required";
    if (!form.slug.en?.trim()) newErrors.slug_en = "Slug is required";
    return newErrors;
  };

  const markTouched = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      axiosClient
        .get(`/products/${id}`)
        .then(({ data }) => {
          const p = data;
          setForm((prev) => ({
            ...prev,
            name: parseJSON(p.name) || { ...emptyLang },
            slug: parseJSON(p.slug) || { ...emptyLang },
            description: parseJSON(p.description) || { ...emptyLang },
            article: parseJSON(p.article) || { ...emptyLang },
            meta_title: parseJSON(p.meta_title) || { ...emptyLang },
            meta_description: parseJSON(p.meta_description) || { ...emptyLang },
            canonical: parseJSON(p.canonical) || { ...emptyLang },
            status: p.status,
            properties: parseJSON(p.properties) || { ...emptyLang },
          }));
          if (p.photo) {
            setPhotoPreview(
              p.photo.startsWith("http")
                ? p.photo
                : `${import.meta.env.VITE_API_BASE_URL + p.photo}`,
            );
          }
          if (p.images && p.images.length) {
            setForm((prev) => ({
              ...prev,
              gallery: p.images.map((g) => g.path).filter(Boolean),
            }));
            setGalleryPreviews(
              p.images
                .map((g) =>
                  g.path
                    ? g.path.startsWith("http")
                      ? g.path
                      : `${import.meta.env.VITE_API_BASE_URL + g.path}`
                    : null,
                )
                .filter(Boolean),
            );
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleLangChange = (field, lang, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value },
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleChange("photo", file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const removePhoto = () => {
    setConfirmModal({
      open: true,
      title: "Remove Photo",
      message: "Are you sure you want to remove this photo?",
      onConfirm: () => {
        handleChange("photo", null);
        setPhotoPreview(null);
      },
    });
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) {
      handleChange("gallery", [...form.gallery, ...files]);
      setGalleryPreviews([
        ...galleryPreviews,
        ...files.map((f) => URL.createObjectURL(f)),
      ]);
    }
  };

  const removeGalleryImage = (index) => {
    setConfirmModal({
      open: true,
      title: "Delete Image",
      message: "Are you sure you want to delete this image from the gallery?",
      onConfirm: () => {
        const newGallery = [...form.gallery];
        newGallery.splice(index, 1);
        handleChange("gallery", newGallery);
        const newPreviews = [...galleryPreviews];
        newPreviews.splice(index, 1);
        setGalleryPreviews(newPreviews);
      },
    });
  };

  const moveGalleryImage = (fromIndex, direction) => {
    const toIndex = fromIndex + direction;
    if (toIndex < 0 || toIndex >= form.gallery.length) return;
    const newGallery = [...form.gallery];
    [newGallery[fromIndex], newGallery[toIndex]] = [
      newGallery[toIndex],
      newGallery[fromIndex],
    ];
    handleChange("gallery", newGallery);
    const newPreviews = [...galleryPreviews];
    [newPreviews[fromIndex], newPreviews[toIndex]] = [
      newPreviews[toIndex],
      newPreviews[fromIndex],
    ];
    setGalleryPreviews(newPreviews);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTouched({ name_en: true, slug_en: true });
      return;
    }
    setSaving(true);
    setErrors({});

    const formData = new FormData();
    formData.append("name", JSON.stringify(form.name));
    formData.append("slug", JSON.stringify(form.slug));
    formData.append("description", JSON.stringify(form.description));
    formData.append("article", JSON.stringify(form.article));
    formData.append("meta_title", JSON.stringify(form.meta_title));
    formData.append("meta_description", JSON.stringify(form.meta_description));
    formData.append("canonical", JSON.stringify(form.canonical));
    formData.append("status", form.status);

    if (form.properties.en || form.properties.fa || form.properties.ru) {
      formData.append("properties", JSON.stringify(form.properties));
    }

    if (form.photo && typeof form.photo !== "string") {
      formData.append("photo", form.photo);
    } else if (isEdit && form.photo === null && photoPreview === null) {
      formData.append("photo_remove", "true");
    }

    const keptPaths = form.gallery.filter((item) => typeof item === "string");
    if (isEdit && keptPaths.length >= 0) {
      formData.append("gallery_paths", JSON.stringify(keptPaths));
    }
    form.gallery.forEach((file) => {
      if (typeof file !== "string") {
        formData.append("images", file);
      }
    });

    const request = isEdit
      ? axiosClient.put(`/products/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      : axiosClient.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

    request
      .then(() => navigate("/products"))
      .catch((err) => {
        const resp = err.response;
        if (resp?.status === 422) {
          setErrors(resp.data.errors || {});
        } else {
          const msg = resp?.data?.message || resp?.statusText || err.message;
          alert("Update failed: " + msg);
          console.error("Product save error:", err);
        }
      })
      .finally(() => setSaving(false));
  };

  const tabs = [
    { id: "en", label: "English" },
    { id: "fa", label: "فارسی" },
    { id: "ru", label: "Русский" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEdit ? "Edit Product" : "Create Product"}
      </h1>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Language tabs */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-4">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={activeTab === tab.id ? "" : "hidden"}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name ({tab.label}){" "}
                      {tab.id === "en" && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={form.name[tab.id]}
                      onChange={(e) =>
                        handleLangChange("name", tab.id, e.target.value)
                      }
                      onBlur={() => tab.id === "en" && markTouched("name_en")}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                        touched.name_en && tab.id === "en" && errors.name_en
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                    {touched.name_en && tab.id === "en" && errors.name_en && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.name_en}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug ({tab.label}){" "}
                      {tab.id === "en" && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={form.slug[tab.id]}
                      onChange={(e) =>
                        handleLangChange("slug", tab.id, e.target.value)
                      }
                      onBlur={() => tab.id === "en" && markTouched("slug_en")}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                        touched.slug_en && tab.id === "en" && errors.slug_en
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                    {touched.slug_en && tab.id === "en" && errors.slug_en && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.slug_en}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description ({tab.label})
                  </label>
                  <textarea
                    value={form.description[tab.id]}
                    onChange={(e) =>
                      handleLangChange("description", tab.id, e.target.value)
                    }
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Article ({tab.label})
                  </label>
                  <RichEditor
                    value={form.article[tab.id]}
                    onChange={(content) =>
                      handleLangChange("article", tab.id, content)
                    }
                    onImageUpload={uploadImage}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Title ({tab.label})
                    </label>
                    <input
                      type="text"
                      value={form.meta_title[tab.id]}
                      onChange={(e) =>
                        handleLangChange("meta_title", tab.id, e.target.value)
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Description ({tab.label})
                    </label>
                    <textarea
                      value={form.meta_description[tab.id]}
                      onChange={(e) =>
                        handleLangChange(
                          "meta_description",
                          tab.id,
                          e.target.value,
                        )
                      }
                      rows={2}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Canonical ({tab.label})
                    </label>
                    <input
                      type="text"
                      value={form.canonical[tab.id]}
                      onChange={(e) =>
                        handleLangChange("canonical", tab.id, e.target.value)
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Properties ({tab.label})
                  </label>
                  <textarea
                    value={form.properties[tab.id]}
                    onChange={(e) =>
                      handleLangChange("properties", tab.id, e.target.value)
                    }
                    rows={4}
                    placeholder="e.g. Fuel: Gas, Color: White"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y font-mono text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <button
              type="button"
              onClick={() => handleChange("status", form.status === 1 ? 0 : 1)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${form.status === 1 ? "bg-blue-600" : "bg-gray-300"}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${form.status === 1 ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
            <span className="text-sm text-gray-500">
              {form.status === 1 ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Photo */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Photo</h3>
          <div className="flex items-center gap-4">
            {photoPreview && (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt=""
                  className="w-24 h-24 rounded-lg object-cover border"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                >
                  x
                </button>
              </div>
            )}
            <label className="cursor-pointer">
              <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm">
                {photoPreview ? "Change Photo" : "Upload Photo"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Gallery</h3>
          <div className="flex flex-wrap gap-3">
            {galleryPreviews.map((src, index) => (
              <div key={index} className="relative group">
                <img
                  src={src}
                  alt=""
                  className="w-24 h-24 rounded-lg object-cover border"
                />
                <span className="absolute top-1 left-1 w-5 h-5 bg-black/60 text-white rounded-full text-xs flex items-center justify-center font-medium">
                  {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeGalleryImage(index)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                >
                  x
                </button>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-0.5 opacity-0 group-hover:opacity-100 transition">
                  <button
                    type="button"
                    onClick={() => moveGalleryImage(index, -1)}
                    disabled={index === 0}
                    className="w-5 h-5 bg-gray-800 text-white rounded text-xs flex items-center justify-center hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ^
                  </button>
                  <button
                    type="button"
                    onClick={() => moveGalleryImage(index, 1)}
                    disabled={index === form.gallery.length - 1}
                    className="w-5 h-5 bg-gray-800 text-white rounded text-xs flex items-center justify-center hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    v
                  </button>
                </div>
              </div>
            ))}
            <label className="cursor-pointer">
              <span className="block w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 transition">
                +
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : isEdit
                ? "Update Product"
                : "Create Product"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      {confirmModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setConfirmModal({ ...confirmModal, open: false })}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="p-6 text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <svg
                  className="w-7 h-7 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {confirmModal.title}
              </h3>
              <p className="text-sm text-gray-500">{confirmModal.message}</p>
            </div>
            <div className="flex border-t border-gray-200">
              <button
                type="button"
                onClick={() =>
                  setConfirmModal({ ...confirmModal, open: false })
                }
                className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal({
                    open: false,
                    title: "",
                    message: "",
                    onConfirm: null,
                  });
                }}
                className="flex-1 px-4 py-3 text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition border-l border-gray-200"
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
