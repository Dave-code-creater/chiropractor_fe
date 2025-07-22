import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Clock, 
  Eye, 
  User, 
  Tag,
  ArrowLeft,
  Share2,
  BookOpen
} from "lucide-react";
import BlogContentRenderer from "./BlogContentRenderer";

const BlogPostViewer = ({ post, onBack }) => {
  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatReadTime = (content) => {
    if (!content || !Array.isArray(content)) return "1 min read";
    
    const wordCount = content.reduce((count, block) => {
      if (block.text) {
        return count + block.text.split(" ").length;
      }
      if (block.items) {
        return count + block.items.join(" ").split(" ").length;
      }
      return count;
    }, 0);
    
    const readTime = Math.ceil(wordCount / 200); // Assuming 200 words per minute
    return `${readTime} min read`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        // Error sharing handled silently
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast here
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      {onBack && (
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Button>
        </div>
      )}

      {/* Header */}
      <header className="mb-8">
        {/* Category Badge */}
        {post.category && (
          <div className="mb-4">
            <Badge variant="secondary" className="text-sm">
              {post.category.charAt(0).toUpperCase() + post.category.slice(1).replace('-', ' ')}
            </Badge>
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            {post.excerpt}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8">
          {/* Author */}
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="font-medium text-gray-700">{post.author_name}</span>
          </div>

          {/* Published Date */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(post.published_at || post.created_at)}</span>
          </div>

          {/* Read Time */}
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{formatReadTime(post.content)}</span>
          </div>

          {/* View Count */}
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span>{post.view_count || 0} views</span>
          </div>

          {/* Share Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleShare}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>

        <Separator className="mb-8" />
      </header>

      {/* Featured Image */}
      {post.featured_image && (
        <div className="mb-8">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-auto rounded-lg shadow-lg"
            style={{ maxHeight: "500px", objectFit: "cover" }}
          />
        </div>
      )}

      {/* Content */}
      <div className="mb-12">
        <BlogContentRenderer content={post.content} />
      </div>

      {/* Footer */}
      <footer className="border-t pt-8">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Author Info */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Written by {post.author_name}
              </h3>
              <p className="text-sm text-gray-600">
                Published on {formatDate(post.published_at || post.created_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Back to Blog Button */}
        {onBack && (
          <div className="mt-8 text-center">
            <Button onClick={onBack} className="flex items-center gap-2 mx-auto">
              <BookOpen className="h-4 w-4" />
              Read More Articles
            </Button>
          </div>
        )}
      </footer>
    </article>
  );
};

export default BlogPostViewer; 