import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Role-based components
import BlogEditor from "./components/doctor/BlogEditor";
import BlogManagement from "./components/doctor/BlogManagement";
import BlogOverview from "./components/admin/BlogOverview";

// Common components
import BlogListing from "./components/BlogListing";
import BlogViewer from "./components/BlogViewer";

const BlogRouter = () => {
  const userRole = useSelector((state) => state.auth.role);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Role-based access control
  const canAccessEditor = userRole === "doctor" || userRole === "admin";
  const canAccessManagement = userRole === "doctor" || userRole === "admin";
  const canAccessAdmin = userRole === "admin";

  return (
    <Routes>
      {/* Blog viewing routes - same for all users */}
      <Route path="/" element={<BlogListing />} />
      <Route path="post/:id" element={<BlogViewer />} />
      <Route path=":slug" element={<BlogViewer />} />

      {/* Doctor and Admin routes */}
      {canAccessManagement && (
        <>
          <Route path="manage" element={<BlogManagement />} />
          <Route path="management" element={<BlogManagement />} />
        </>
      )}

      {canAccessEditor && (
        <>
          <Route path="editor" element={<BlogEditor />} />
          <Route path="editor/:postId" element={<BlogEditor />} />
        </>
      )}

      {/* Admin-only routes */}
      {canAccessAdmin && (
        <>
          <Route path="admin" element={<BlogOverview />} />
          <Route path="admin/overview" element={<BlogOverview />} />
        </>
      )}

      {/* Role-based redirects */}
      <Route
        path="dashboard"
        element={
          <Navigate
            to={
              userRole === "admin"
                ? "admin"
                : canAccessManagement
                  ? "manage"
                  : "/"
            }
            replace
          />
        }
      />

      {/* Protected route fallbacks */}
      <Route
        path="editor/*"
        element={
          canAccessEditor ? (
            <Navigate to="editor" replace />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="manage/*"
        element={
          canAccessManagement ? (
            <Navigate to="manage" replace />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="admin/*"
        element={
          canAccessAdmin ? (
            <Navigate to="admin" replace />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Catch all - redirect to main blog */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default BlogRouter; 