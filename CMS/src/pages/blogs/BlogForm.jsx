import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import { parseJSON } from "../../utils/parseField";
import { uploadImage } from "../../utils/uploadImage";
import RichEditor from "../../components/RichEditor";

export default function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("en");
  const [errors, setErrors] = useState({});

  const emptyLang = { en: "", fa: "", ru: "" };

  const [form, setForm] = useState({
    title: { ...emptyLang },
    slug: { ...emptyLang },
    description: { ...emptyLang },
    article: { ...emptyLang },
    meta_title: { ...emptyLang },
    meta_description: { ...emptyLang },
    canonical: { ...emptyLang },
    selva_generator: { ...emptyLang },
    status: 1,
    published_date: "",
    card_image: null,
    card_bg: null,
  });

  const [cardImagePreview, setCardImagePreview] = useState(null);
  const [cardBgPreview, setCardBgPreview] = useState(null);
  const [bgImages, setBgImages] = useState([]);
  const [showBgPicker, setShowBgPicker] = useState(false);

  useEffect(() => {
    axiosClient
      .get("/blogs/backgrounds")
      .then(({ data }) => setBgImages(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      axiosClient
        .get(`/blogs/${id}`)
        .then(({ data }) => {
          const b = data;
          setForm((prev) => ({
            ...prev,
            title: parseJSON(b.title) || { ...emptyLang },
            slug: parseJSON(b.slug) || { ...emptyLang },
            description: parseJSON(b.description) || { ...emptyLang },
            article: parseJSON(b.article) || { ...emptyLang },
            meta_title: parseJSON(b.meta_title) || { ...emptyLang },
            meta_description: parseJSON(b.meta_description) || { ...emptyLang },
            canonical: parseJSON(b.canonical) || { ...emptyLang },
            selva_generator: parseJSON(b.selva_generator) || { ...emptyLang },
            status: b.status,
            published_date: b.published_date || "",
          }));
          if (b.card_image) {
            setCardImagePreview(
              b.card_image.startsWith("http")
                ? b.card_image
                : `${import.meta.env.VITE_API_BASE_URL + b.card_image}`,
            );
          }
          if (b.card_bg) {
            setCardBgPreview(
              b.card_bg.startsWith("http")
                ? b.card_bg
                : `${import.meta.env.VITE_API_BASE_URL + b.card_bg}`,
            );
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const [touched, setTouched] = useState({});

  const markTouched = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.en?.trim()) e.title_en = "Title is required";
    if (!form.slug.en?.trim()) e.slug_en = "Slug is required";
    if (!isEdit && !form.card_image) e.card_image = "Card image is required";
    return e;
  };

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

  const handleCardImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleChange("card_image", file);
      setCardImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCardBgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleChange("card_bg", file);
      setCardBgPreview(URL.createObjectURL(file));
    }
  };

  const selectBgImage = (imageUrl) => {
    handleChange("card_bg", imageUrl);
    setCardBgPreview(imageUrl);
    setShowBgPicker(false);
  };

  const clearCardBg = () => {
    handleChange("card_bg", null);
    setCardBgPreview(null);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTouched({ title_en: true, slug_en: true, card_image: true });
      return;
    }
    setSaving(true);
    setErrors({});

    const formData = new FormData();
    formData.append("title", JSON.stringify(form.title));
    formData.append("slug", JSON.stringify(form.slug));
    formData.append("description", JSON.stringify(form.description));
    formData.append("article", JSON.stringify(form.article));
    formData.append("meta_title", JSON.stringify(form.meta_title));
    formData.append("meta_description", JSON.stringify(form.meta_description));
    formData.append("canonical", JSON.stringify(form.canonical));
    formData.append("selva_generator", JSON.stringify(form.selva_generator));
    formData.append("status", form.status);
    formData.append("published_date", form.published_date);

    if (form.card_image && typeof form.card_image !== "string") {
      formData.append("card_image", form.card_image);
    }
    if (form.card_bg) {
      if (typeof form.card_bg === "string") {
        // URL selected from library — extract relative path
        const bgPath = form.card_bg.replace(
          import.meta.env.VITE_API_BASE_URL,
          "",
        );
        formData.append("card_bg_path", bgPath);
      } else {
        formData.append("card_bg", form.card_bg);
      }
    }

    const request = isEdit
      ? axiosClient.put(`/blogs/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      : axiosClient.post("/blogs", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

    request
      .then(() => navigate("/blogs"))
      .catch((err) => {
        const resp = err.response;
        if (resp?.status === 422) {
          setErrors(resp.data.errors || {});
        } else {
          const msg = resp?.data?.message || resp?.statusText || err.message;
          alert("Update failed: " + msg);
          console.error("Blog save error:", err);
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
        {isEdit ? "Edit Blog" : "Create Blog"}
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
                      Title ({tab.label}){" "}
                      {tab.id === "en" && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={form.title[tab.id]}
                      onChange={(e) =>
                        handleLangChange("title", tab.id, e.target.value)
                      }
                      onBlur={() => tab.id === "en" && markTouched("title_en")}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                        touched.title_en && tab.id === "en" && errors.title_en
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                    {touched.title_en && tab.id === "en" && errors.title_en && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.title_en}
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
                      Meta Desc ({tab.label})
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
                    Selva Generator ({tab.label})
                  </label>
                  <input
                    type="text"
                    value={form.selva_generator[tab.id]}
                    onChange={(e) =>
                      handleLangChange(
                        "selva_generator",
                        tab.id,
                        e.target.value,
                      )
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status & Date */}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Published Date
            </label>
            <input
              type="date"
              value={form.published_date}
              onChange={(e) => handleChange("published_date", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Card Image {!isEdit && <span className="text-red-500">*</span>}
            </h3>
            <div className="flex items-center gap-4">
              {cardImagePreview && (
                <img
                  src={cardImagePreview}
                  alt=""
                  className="w-32 h-20 rounded-lg object-cover border"
                />
              )}
              <label className="cursor-pointer">
                <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm">
                  {cardImagePreview ? "Change" : "Upload"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCardImageChange}
                  className="hidden"
                />
              </label>
            </div>
            {errors.card_image && (
              <p className="mt-1 text-xs text-red-600">{errors.card_image}</p>
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Card Background
            </h3>
            <div className="flex items-center gap-4">
              {cardBgPreview && (
                <div className="relative">
                  <img
                    src={cardBgPreview}
                    alt=""
                    className="w-32 h-20 rounded-lg object-cover border"
                  />
                  <button
                    type="button"
                    onClick={clearCardBg}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                  >
                    x
                  </button>
                </div>
              )}
              <div className="flex gap-2">
                <label className="cursor-pointer">
                  <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm">
                    {cardBgPreview ? "Change" : "Upload"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCardBgChange}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setShowBgPicker(!showBgPicker)}
                  className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm"
                >
                  Choose from Library
                </button>
              </div>
            </div>
            {showBgPicker && (
              <div className="mt-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-700">
                    Background Images
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowBgPicker(false)}
                    className="text-gray-400 hover:text-gray-600 text-sm"
                  >
                    Close
                  </button>
                </div>
                {bgImages.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No background images found in uploads/blogs/bg/
                  </p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {bgImages.map((img) => (
                      <button
                        key={img.name}
                        type="button"
                        onClick={() => selectBgImage(img.url)}
                        className={`relative rounded-lg overflow-hidden border-2 transition hover:border-blue-500 ${
                          cardBgPreview === img.url
                            ? "border-blue-500 ring-2 ring-blue-200"
                            : "border-transparent"
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={img.name}
                          className="w-full h-20 object-cover"
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs px-1 py-0.5 truncate">
                          {img.name}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : isEdit ? "Update Blog" : "Create Blog"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/blogs")}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
