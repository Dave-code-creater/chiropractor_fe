// Main router
export { default as BlogRouter } from './BlogRouter';

// Role-based components (for management only)
export { default as BlogEditor } from './components/doctor/BlogEditor';
export { default as BlogManagement } from './components/doctor/BlogManagement';
export { default as BlogOverview } from './components/admin/BlogOverview';

// Common components (for public viewing)
export { default as BlogListing } from './components/BlogListing';
export { default as BlogViewer } from './components/BlogViewer'; 