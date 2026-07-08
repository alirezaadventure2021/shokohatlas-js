import { useEffect, useState, useRef } from "react";
import axiosClient from "../../axios-client";
import {
  FiFolder,
  FiFile,
  FiImage,
  FiTrash2,
  FiMove,
  FiChevronRight,
  FiHome,
  FiPlus,
  FiX,
  FiCheck,
  FiUpload,
} from "react-icons/fi";

export default function FileManager() {
  const [currentPath, setCurrentPath] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewFile, setPreviewFile] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [moveTarget, setMoveTarget] = useState(null);
  const [folders, setFolders] = useState([]);
  const [moveDestination, setMoveDestination] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchItems();
  }, [currentPath]);

  const fetchItems = () => {
    setLoading(true);
    setError("");
    axiosClient
      .get("/files", { params: { path: currentPath } })
      .then(({ data }) => {
        setItems(data.items || []);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load files");
      })
      .finally(() => setLoading(false));
  };

  const fetchFolders = () => {
    axiosClient
      .get("/files", { params: { path: "" } })
      .then(({ data }) => {
        const folderList = (data.items || [])
          .filter((item) => item.type === "folder")
          .map((f) => f.path);
        setFolders(folderList);
      })
      .catch(() => {});
  };

  const navigateTo = (path) => {
    setCurrentPath(path);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    axiosClient
      .delete("/files", { params: { path: deleteTarget.path } })
      .then(() => {
        setDeleteTarget(null);
        fetchItems();
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to delete");
        setDeleteTarget(null);
      });
  };

  const handleMove = () => {
    if (!moveTarget || !moveDestination) return;
    axiosClient
      .post("/files/move", {
        from: moveTarget.path,
        to: moveDestination,
      })
      .then(() => {
        setMoveTarget(null);
        setMoveDestination("");
        fetchItems();
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to move");
        setMoveTarget(null);
      });
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    const folderPath = currentPath
      ? `${currentPath}/${newFolderName.trim()}`
      : newFolderName.trim();

    axiosClient
      .post("/files/mkdir", { path: folderPath })
      .then(() => {
        setShowNewFolder(false);
        setNewFolderName("");
        fetchItems();
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to create folder");
      });
  };

  const openMoveModal = (item) => {
    setMoveTarget(item);
    fetchFolders();
  };

  const MAX_SIZE_BYTES = 150 * 1024; // 150KB

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");
    setUploadStatus("");

    // Check which files will need compression
    const largeFiles = Array.from(files).filter((f) => f.size > MAX_SIZE_BYTES);
    if (largeFiles.length > 0) {
      setUploadStatus(
        `${largeFiles.length} image(s) will be compressed to 150KB`
      );
    }

    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }

    try {
      const pathParam = currentPath ? `?path=${currentPath}` : "";
      const { data } = await axiosClient.post(
        `/files/upload${pathParam}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Show compression results
      const compressed = data.files?.filter((f) => f.compressed) || [];
      if (compressed.length > 0) {
        const savedKB = compressed.reduce(
          (acc, f) => acc + (f.originalSize - f.size),
          0
        );
        setUploadStatus(
          `${compressed.length} file(s) compressed, saved ${formatSize(savedKB)}`
        );
      } else {
        setUploadStatus("");
      }

      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload files");
      setUploadStatus("");
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e) => {
    handleUpload(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const formatSize = (bytes) => {
    if (bytes === undefined || bytes === null) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getImageUrl = (filePath) => {
    const base = import.meta.env.VITE_API_BASE_URL;
    return `${base}uploads/${filePath}`;
  };

  const breadcrumbs = currentPath
    .split("/")
    .filter(Boolean)
    .map((part, index, arr) => ({
      name: part,
      path: arr.slice(0, index + 1).join("/"),
    }));

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">File Manager</h1>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInput}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {uploading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiUpload size={16} />
            )}
            <span className="hidden sm:inline">{uploading ? "Uploading..." : "Upload"}</span>
          </button>
          <button
            onClick={() => {
              setShowNewFolder(true);
              setNewFolderName("");
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center gap-2"
          >
            <FiPlus size={16} />
            <span className="hidden sm:inline">New Folder</span>
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 mb-4 flex items-center gap-1 text-sm overflow-x-auto">
        <button
          onClick={() => navigateTo("")}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 shrink-0"
        >
          <FiHome size={14} />
          <span>uploads</span>
        </button>
        {breadcrumbs.map((crumb) => (
          <span key={crumb.path} className="flex items-center gap-1 shrink-0">
            <FiChevronRight size={14} className="text-gray-400" />
            <button
              onClick={() => navigateTo(crumb.path)}
              className="text-blue-600 hover:text-blue-800"
            >
              {crumb.name}
            </button>
          </span>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Upload Status */}
      {uploadStatus && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-4 text-sm">
          {uploadStatus}
        </div>
      )}

      {/* New Folder Input */}
      {showNewFolder && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex items-center gap-2">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreateFolder();
              if (e.key === "Escape") setShowNewFolder(false);
            }}
          />
          <button
            onClick={handleCreateFolder}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
          >
            <FiCheck size={18} />
          </button>
          <button
            onClick={() => setShowNewFolder(false)}
            className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition"
          >
            <FiX size={18} />
          </button>
        </div>
      )}

      {/* Content */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`${dragOver ? "ring-2 ring-blue-500 ring-inset rounded-xl" : ""}`}
      >
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className={`bg-white rounded-xl border-2 ${dragOver ? "border-blue-500 border-dashed" : "border-gray-200"} p-12 text-center text-gray-400 transition`}>
            <FiFolder size={48} className="mx-auto mb-3 opacity-50" />
            <p>{dragOver ? "Drop files here" : "This folder is empty"}</p>
            <p className="text-sm mt-2">Drag & drop files or click Upload</p>
          </div>
        ) : (
          <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 ${dragOver ? "opacity-50" : ""}`}>
          {items.map((item) => (
            <div
              key={item.path}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden group hover:border-blue-300 transition"
            >
              {/* Thumbnail */}
              <div
                className={`h-28 flex items-center justify-center ${
                  item.type === "folder"
                    ? "bg-amber-50"
                    : item.isImage
                      ? "bg-gray-50"
                      : "bg-gray-50"
                } cursor-pointer`}
                onClick={() => {
                  if (item.type === "folder") {
                    navigateTo(item.path);
                  } else if (item.isImage) {
                    setPreviewFile(item);
                  }
                }}
              >
                {item.type === "folder" ? (
                  <FiFolder size={36} className="text-amber-500" />
                ) : item.isImage ? (
                  <img
                    src={getImageUrl(item.path)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <FiFile size={36} className="text-gray-400" />
                )}
              </div>

              {/* Info + Actions */}
              <div className="p-3">
                <p
                  className="text-xs font-medium text-gray-900 truncate"
                  title={item.name}
                >
                  {item.name}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {item.type === "folder"
                    ? `${item.itemCount} items`
                    : formatSize(item.size)}
                </p>

                {/* Action buttons - visible on hover (desktop) or always (mobile) */}
                <div className="flex items-center gap-1 mt-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                  {item.type === "file" && item.isImage && (
                    <button
                      onClick={() => setPreviewFile(item)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                      title="Preview"
                    >
                      <FiImage size={14} />
                    </button>
                  )}
                  {item.type === "file" && (
                    <button
                      onClick={() => openMoveModal(item)}
                      className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded transition"
                      title="Move"
                    >
                      <FiMove size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                    title="Delete"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewFile(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewFile(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <FiX size={24} />
            </button>
            <img
              src={getImageUrl(previewFile.path)}
              alt={previewFile.name}
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
            />
            <p className="text-white text-sm text-center mt-3">
              {previewFile.name}
            </p>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete {deleteTarget.type === "folder" ? "Folder" : "File"}
            </h3>
            <p className="text-gray-500 mb-6 text-sm">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-700">
                {deleteTarget.name}
              </span>
              {deleteTarget.type === "folder" && (
                <span className="text-red-600"> and all its contents</span>
              )}
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

      {/* Move Modal */}
      {moveTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Move File
            </h3>
            <p className="text-gray-500 mb-4 text-sm">
              Moving{" "}
              <span className="font-medium text-gray-700">
                {moveTarget.name}
              </span>
            </p>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination folder
            </label>
            <select
              value={moveDestination}
              onChange={(e) => setMoveDestination(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a folder...</option>
              {folders.map((folder) => (
                <option key={folder} value={folder}>
                  {folder}
                </option>
              ))}
            </select>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setMoveTarget(null);
                  setMoveDestination("");
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleMove}
                disabled={!moveDestination}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Move
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
