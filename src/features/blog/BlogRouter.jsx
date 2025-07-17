import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Role-based components
import BlogList from "./components/patient/BlogList";
import BlogEditor from "./components/doctor/BlogEditor";
import BlogManagement from "./components/doctor/BlogManagement";
import BlogOverview from "./components/admin/BlogOverview";
import BlogPost from "./components/user/BlogPost";

// Common components
import RenderBlog from "./components/RenderBlog";

const BlogRouter = () => {
  const userRole = useSelector((state) => state.auth.role);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Role-based access control
  const canAccessEditor = userRole === "doctor" || userRole === "admin";
  const canAccessManagement = userRole === "doctor" || userRole === "admin";
  const canAccessAdmin = userRole === "admin";

  return (
    <Routes>
      {/* Public routes - accessible to all */}
      <Route path="/" element={<BlogList />} />
      <Route path="/post/:id" element={<BlogPost />} />
      <Route path="/blog" element={<RenderBlog />} />

      {/* Doctor and Admin routes */}
      {canAccessEditor && (
        <>
          <Route path="/editor" element={<BlogEditor />} />
          <Route path="/editor/:id" element={<BlogEditor />} />
        </>
      )}

      {canAccessManagement && (
        <Route path="/manage" element={<BlogManagement />} />
      )}

      {/* Admin-only routes */}
      {canAccessAdmin && (
        <>
          <Route path="/admin" element={<BlogOverview />} />
          <Route path="/admin/overview" element={<BlogOverview />} />
        </>
      )}

      {/* Role-based redirects */}
      <Route
        path="/dashboard"
        element={
          <Navigate
            to={
              userRole === "admin"
                ? "/blog/admin"
                : canAccessManagement
                ? "/blog/manage"
                : "/blog"
            }
            replace
          />
        }
      />

      {/* Protected route fallbacks */}
      <Route
        path="/editor/*"
        element={
          canAccessEditor ? (
            <Navigate to="/blog/editor" replace />
          ) : (
            <Navigate to="/blog" replace />
          )
        }
      />

      <Route
        path="/manage/*"
        element={
          canAccessManagement ? (
            <Navigate to="/blog/manage" replace />
          ) : (
            <Navigate to="/blog" replace />
          )
        }
      />

      <Route
        path="/admin/*"
        element={
          canAccessAdmin ? (
            <Navigate to="/blog/admin" replace />
          ) : (
            <Navigate to="/blog" replace />
          )
        }
      />

      {/* Catch all - redirect to main blog */}
      <Route path="*" element={<Navigate to="/blog" replace />} />
    </Routes>
  );
};

export default BlogRouter; 