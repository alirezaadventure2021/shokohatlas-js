import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ContextProvider } from "./context/AuthContext";
import AdminLayout from "./layouts/AdminLayout";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import ProductsList from "./pages/products/ProductsList";
import ProductForm from "./pages/products/ProductForm";
import ProductView from "./pages/products/ProductView";
import BlogsList from "./pages/blogs/BlogsList";
import BlogForm from "./pages/blogs/BlogForm";
import BlogView from "./pages/blogs/BlogView";
import ServicesList from "./pages/services/ServicesList";
import ServiceForm from "./pages/services/ServiceForm";
import ServiceView from "./pages/services/ServiceView";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <ContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<ProductsList />} />
            <Route path="/products/create" element={<ProductForm />} />
            <Route path="/products/:id" element={<ProductView />} />
            <Route path="/products/:id/edit" element={<ProductForm />} />
            <Route path="/blogs" element={<BlogsList />} />
            <Route path="/blogs/create" element={<BlogForm />} />
            <Route path="/blogs/:id" element={<BlogView />} />
            <Route path="/blogs/:id/edit" element={<BlogForm />} />
            <Route path="/services" element={<ServicesList />} />
            <Route path="/services/create" element={<ServiceForm />} />
            <Route path="/services/:id" element={<ServiceView />} />
            <Route path="/services/:id/edit" element={<ServiceForm />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ContextProvider>
  );
}
