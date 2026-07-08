import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/AuthContext";
import { FiHome, FiBox, FiFileText, FiLayers, FiLogOut, FiMenu, FiX, FiUser, FiFolder, FiMail } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import axiosClient from "../axios-client";

export default function AdminLayout() {
  const { user, logout, token } = useStateContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  const fetchUnreadCount = () => {
    axiosClient
      .get("/messages/unread-count")
      .then(({ data }) => {
        setUnreadCount(data.count || 0);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchUnreadCount();
    // Poll for new messages every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!token) {
    return <Navigate to="/login" />;
  }

  const navLinks = [
    { to: "/", icon: FiHome, label: "Dashboard" },
    { to: "/products", icon: FiBox, label: "Products" },
    { to: "/blogs", icon: FiFileText, label: "Blogs" },
    { to: "/services", icon: FiLayers, label: "Services" },
    { to: "/files", icon: FiFolder, label: "Files" },
    { to: "/messages", icon: FiMail, label: "Messages", badge: unreadCount },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#1e293b] text-white transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-700">
          <Link to="/" className="text-xl font-bold tracking-wide">Shokoh Admin</Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <FiX size={20} />
          </button>
        </div>

        <nav className="mt-6 px-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 mb-1 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <link.icon size={20} />
              <span>{link.label}</span>
              {link.badge > 0 && (
                <span className="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <FiMenu size={22} />
          </button>
          <div className="hidden lg:block" />

          {/* Messages icon with badge */}
          <Link
            to="/messages"
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
          >
            <FiMail size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full min-w-[18px] text-center">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Link>

          <div className="relative" ref={dropdownRef}>
            {user && (
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-9 h-9 rounded-full bg-blue-600 text-white font-semibold text-sm flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                {user.name?.charAt(0).toUpperCase()}
              </button>
            )}
            {dropdownOpen && (
              <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <FiUser size={16} />
                  Profile
                </Link>
                <button
                  onClick={() => { setDropdownOpen(false); logout(); }}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                >
                  <FiLogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
