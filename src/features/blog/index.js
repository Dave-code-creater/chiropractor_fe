// Main router
export { default as BlogRouter } from './BlogRouter';

// Role-based components
export { default as BlogList } from './components/patient/BlogList';
export { default as BlogEditor } from './components/doctor/BlogEditor';
export { default as BlogManagement } from './components/doctor/BlogManagement';
export { default as BlogOverview } from './components/admin/BlogOverview';

// Common components
export { default as BlogPost } from './components/user/BlogPost';
export { default as RenderBlog } from './components/RenderBlog';

// Legacy exports for backward compatibility
export { default as Blog } from './components/user/Blog'; 