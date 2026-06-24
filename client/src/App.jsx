import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import SpotlightSearch from "./components/SpotlightSearch";

// Lazy-loaded pages — reduces initial bundle size, improves performance on mobile
const Landing    = lazy(() => import("./pages/Landing"));
const Login      = lazy(() => import("./pages/Login"));
const Register   = lazy(() => import("./pages/Register"));
const Dashboard   = lazy(() => import("./pages/Dashboard"));
const JobList     = lazy(() => import("./pages/JobList"));
const AddJob      = lazy(() => import("./pages/AddJob"));
const EditJob     = lazy(() => import("./pages/EditJob"));

function PageFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
    </div>
  );
}

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageFallback />;
  return user ? children : <Navigate to="/login" />;
};

// "/" shows the public Landing page to logged-out visitors,
// and the Dashboard to logged-in users.
const HomeRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <PageFallback />;
  return user ? <Dashboard /> : <Landing />;
};

function AppRoutes() {
  const { user } = useAuth();
  return (
    <BrowserRouter>
      {user && <Navbar />}
      {user && <SpotlightSearch />}
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/login"    element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/"          element={<HomeRoute />} />
          <Route path="/jobs"      element={<PrivateRoute><JobList /></PrivateRoute>} />
          <Route path="/add"       element={<PrivateRoute><AddJob /></PrivateRoute>} />
          <Route path="/edit/:id"  element={<PrivateRoute><EditJob /></PrivateRoute>} />
        </Routes>
      </Suspense>
      {user && <ScrollToTop />}
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: "var(--toast-bg, #fff)", color: "#0F172A", borderRadius: "12px", fontSize: "14px", boxShadow: "0 4px 24px -4px rgba(15,23,42,0.12)" },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}
