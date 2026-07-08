import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { FiBox, FiFileText, FiLayers, FiMail, FiFolder } from "react-icons/fi";

export default function Dashboard() {
  const [counts, setCounts] = useState({ products: 0, blogs: 0, services: 0, messages: 0, files: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [productsRes, blogsRes, servicesRes, messagesRes, filesRes] = await Promise.allSettled([
          axiosClient.get("/products"),
          axiosClient.get("/blogs"),
          axiosClient.get("/services"),
          axiosClient.get("/messages"),
          axiosClient.get("/files"),
        ]);

        setCounts({
          products: productsRes.status === "fulfilled" ? (productsRes.value.data?.total ?? productsRes.value.data?.data?.length ?? productsRes.value.data?.length ?? 0) : 0,
          blogs: blogsRes.status === "fulfilled" ? (blogsRes.value.data?.total ?? blogsRes.value.data?.data?.length ?? blogsRes.value.data?.length ?? 0) : 0,
          services: servicesRes.status === "fulfilled" ? (servicesRes.value.data?.total ?? servicesRes.value.data?.data?.length ?? servicesRes.value.data?.length ?? 0) : 0,
          messages: messagesRes.status === "fulfilled" ? (Array.isArray(messagesRes.value.data) ? messagesRes.value.data.length : 0) : 0,
          files: filesRes.status === "fulfilled" ? (filesRes.value.data?.items?.length ?? 0) : 0,
        });
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  const cards = [
    { label: "Products", count: counts.products, icon: FiBox, to: "/products", color: "blue" },
    { label: "Blogs", count: counts.blogs, icon: FiFileText, to: "/blogs", color: "green" },
    { label: "Services", count: counts.services, icon: FiLayers, to: "/services", color: "purple" },
    { label: "Messages", count: counts.messages, icon: FiMail, to: "/messages", color: "amber" },
    { label: "Files", count: counts.files, icon: FiFolder, to: "/files", color: "slate" },
  ];

  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    amber: "bg-amber-50 text-amber-600",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {cards.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{card.count}</p>
                </div>
                <div className={`p-3 rounded-xl ${colorMap[card.color]}`}>
                  <card.icon size={24} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
