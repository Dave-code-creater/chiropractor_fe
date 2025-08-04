import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    selectUserId,
    selectUserRole,
    selectIsAuthenticated,
} from "@/state/data/authSlice";
import {
    useGetBlogPostByIdQuery,
} from "@/api/services/blogApi";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Calendar,
    Clock,
    Eye,
    BookOpen,
    ArrowLeft,
    Share2,
} from "lucide-react";
import { toast } from "sonner";
import BlogContentRenderer from "./BlogContentRenderer";

const BLOG_CATEGORIES = [
    { value: "chiropractic-care", label: "Chiropractic Care" },
    { value: "spine-health", label: "Spine Health" },
    { value: "pain-management", label: "Pain Management" },
    { value: "wellness", label: "Wellness & Prevention" },
    { value: "exercise", label: "Exercise & Therapy" },
    { value: "nutrition", label: "Nutrition & Lifestyle" },
    { value: "patient-stories", label: "Patient Stories" },
    { value: "clinic-news", label: "Clinic News" },
];

const BlogViewer = () => {
    const { slug, id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Get user info from Redux state
    const userID = useSelector(selectUserId);
    const userRole = useSelector(selectUserRole);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    // Determine which parameter to use for fetching
    const postIdentifier = id || slug;

    // Fetch the specific blog post
    const {
        data: postData,
        isLoading: postLoading,
        error: postError,
    } = useGetBlogPostByIdQuery(postIdentifier, {
        skip: !postIdentifier,
    });

    const post = postData?.data || postData;

    // Helper functions
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatReadTime = (content) => {
        if (!content) return "1 min read";
        const wordsPerMinute = 200;
        let text = '';

        // If it's a string, use it directly
        if (typeof content === 'string') {
            text = content.replace(/<[^>]*>/g, "");
        }
        // If it's structured content, extract text recursively
        else if (content?.type === 'doc' && content?.content) {
            text = extractTextFromContent(content.content);
        }
        // Fallback
        else {
            text = JSON.stringify(content || '');
        }

        const words = text.split(/\s+/).filter(word => word.length > 0).length;
        const readTime = Math.ceil(words / wordsPerMinute);
        return `${readTime} min read`;
    };

    const extractTextFromContent = (content) => {
        if (!content || !Array.isArray(content)) return '';

        return content.map(block => {
            if (block.type === 'paragraph' && block.content) {
                return block.content.map(inline => {
                    if (inline.type === 'text') return inline.text;
                    return '';
                }).join('');
            }
            if (block.type === 'heading' && block.content) {
                return block.content.map(inline => {
                    if (inline.type === 'text') return inline.text;
                    return '';
                }).join('');
            }
            return '';
        }).join(' ');
    };

    const getCategoryLabel = (categorySlug) => {
        const category = BLOG_CATEGORIES.find((cat) => cat.value === categorySlug);
        return category ? category.label : categorySlug;
    };

    const getCategoryColor = (categorySlug) => {
        const colors = {
            "chiropractic-care": "bg-blue-500",
            "spine-health": "bg-green-500",
            "pain-management": "bg-red-500",
            "wellness": "bg-purple-500",
            "exercise": "bg-orange-500",
            "nutrition": "bg-yellow-500",
            "patient-stories": "bg-pink-500",
            "clinic-news": "bg-gray-500",
        };
        return colors[categorySlug] || "bg-gray-500";
    };

    const getBlogListUrl = () => {
        // Use current context - if in dashboard, stay in dashboard
        if (location.pathname.includes('/dashboard/')) {
            return `/dashboard/${userRole}/${userID}/blog`;
        }
        // Otherwise use public blog URL
        return `/blog`;
    };

    const handleShare = () => {
        const url = window.location.href;
        if (navigator.share) {
            navigator.share({
                title: post.title,
                text: post.excerpt,
                url: url,
            });
        } else {
            navigator.clipboard.writeText(url);
            toast.success("Link copied to clipboard!");
        }
    };

    // Loading state
    if (postLoading) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="space-y-6">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-64 w-full" />
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (postError || !post) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="space-y-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(getBlogListUrl())}
                        className="gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Blog
                    </Button>

                    <Card className="p-8 text-center">
                        <div className="space-y-4">
                            <div className="p-4 rounded-full bg-destructive/10 w-fit mx-auto">
                                <BookOpen className="w-8 h-8 text-destructive" />
                            </div>
                            <h1 className="text-2xl font-bold">Post Not Found</h1>
                            <p className="text-muted-foreground">
                                The blog post you're looking for doesn't exist or has been removed.
                            </p>
                            <Button onClick={() => navigate(getBlogListUrl())}>
                                Go to Blog
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="space-y-6">
                {/* Back to Blog Button */}
                <Button
                    variant="ghost"
                    onClick={() => navigate(getBlogListUrl())}
                    className="gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Blog
                </Button>

                {/* Post Content */}
                <article className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    {/* Featured Image */}
                    {post.featured_image && (
                        <div className="w-full h-64 md:h-80 overflow-hidden">
                            <img
                                src={post.featured_image}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="p-6 md:p-8">
                        {/* Category Badge */}
                        {post.category && (
                            <Badge
                                className="mb-4"
                                style={{
                                    backgroundColor: getCategoryColor(post.category),
                                    color: "white",
                                }}
                            >
                                {getCategoryLabel(post.category)}
                            </Badge>
                        )}

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                            {post.title}
                        </h1>

                        {/* Excerpt */}
                        {post.excerpt && (
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                {post.excerpt}
                            </p>
                        )}

                        {/* Meta Information */}
                        <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-8">
                            <div className="flex items-center gap-6 text-sm text-gray-500">
                                {/* Author */}
                                <div className="flex items-center gap-2">
                                    <Avatar className="w-8 h-8">
                                        <AvatarFallback>
                                            {(post.author_name || post.author || 'A')[0].toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium text-gray-900">
                                            {post.author_name || post.author || 'Anonymous'}
                                        </div>
                                    </div>
                                </div>

                                {/* Date */}
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {formatDate(post.published_at || post.created_at)}
                                </div>

                                {/* Read Time */}
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {formatReadTime(post.content)}
                                </div>

                                {/* Views */}
                                {post.view_count !== undefined && (
                                    <div className="flex items-center gap-1">
                                        <Eye className="w-4 h-4" />
                                        {post.view_count} views
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleShare}
                                    className="gap-2"
                                >
                                    <Share2 className="w-4 h-4" />
                                    Share
                                </Button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="prose prose-lg max-w-none">
                            {post.content && (
                                <BlogContentRenderer content={post.content} />
                            )}
                        </div>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h3 className="text-sm font-medium text-gray-900 mb-3">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map((tag, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </article>

                {/* Back to Blog Button (Bottom) */}
                <div className="text-center">
                    <Button
                        variant="outline"
                        onClick={() => navigate(getBlogListUrl())}
                        className="gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to All Articles
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BlogViewer;
