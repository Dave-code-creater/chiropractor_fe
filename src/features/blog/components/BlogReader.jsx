import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetPublicBlogPostsQuery, useGetBlogPostByIdQuery } from "@/api/services/blogApi";
import BlogListing from "./BlogListing";
import BlogPostViewer from "./BlogPostViewer";
import { toast } from "sonner";

const BlogReader = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedPost, setSelectedPost] = useState(null);
  const [postId, setPostId] = useState(null);

  // Fetch all public posts for listing
  const {
    data: postsData,
    isLoading: isPostsLoading,
    error: postsError,
    refetch: refetchPosts,
  } = useGetPublicBlogPostsQuery({
    search: searchTerm || undefined,
    category: categoryFilter === "all" ? undefined : categoryFilter,
    limit: 20,
  });

  // Fetch specific post if we have a slug/ID
  const {
    data: postData,
    isLoading: isPostLoading,
    error: postError,
  } = useGetBlogPostByIdQuery(postId, {
    skip: !postId,
  });

  const posts = postsData?.data?.posts || [];

  // Handle slug-based routing
  useEffect(() => {
    if (slug && posts.length > 0) {
      const post = posts.find(p => p.slug === slug);
      if (post) {
        setSelectedPost(post);
        setPostId(post.id);
      } else {
        // If slug not found in current posts, try to fetch by ID if slug is numeric
        const numericId = parseInt(slug);
        if (!isNaN(numericId)) {
          setPostId(numericId);
        } else {
          toast.error("Blog post not found");
          navigate("/blog");
        }
      }
    } else if (!slug) {
      setSelectedPost(null);
      setPostId(null);
    }
  }, [slug, posts, navigate]);

  // Update selected post when fetched data arrives
  useEffect(() => {
    if (postData?.data) {
      setSelectedPost(postData.data);
    }
  }, [postData]);

  const handlePostClick = (post) => {
    setSelectedPost(post);
    navigate(`/blog/${post.slug}`);
  };

  const handleBackToListing = () => {
    setSelectedPost(null);
    navigate("/blog");
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleCategoryFilter = (value) => {
    setCategoryFilter(value);
  };

  // Handle errors
  if (postsError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error Loading Blog Posts
          </h3>
          <p className="text-red-600 mb-4">
            Unable to load blog posts at this time. Please try again later.
          </p>
          <button
            onClick={() => refetchPosts()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show single post view
  if (selectedPost) {
    return (
      <BlogPostViewer 
        post={selectedPost} 
        onBack={handleBackToListing}
      />
    );
  }

  // Show blog listing
  return (
    <BlogListing
      posts={posts}
      isLoading={isPostsLoading}
      onPostClick={handlePostClick}
      onSearch={handleSearch}
      onCategoryFilter={handleCategoryFilter}
    />
  );
};

export default BlogReader; 