import React, { useState, useMemo, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    selectUserId,
    selectUserRole,
    selectIsAuthenticated,
} from "@/state/data/authSlice";
import {
    useGetPublicBlogPostsQuery,
    useGetCategoriesQuery,
    useGetBlogPostByIdQuery,
} from "@/api/services/blogApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Search,
    Calendar,
    Clock,
    Eye,
    Heart,
    User,
    Tag,
    BookOpen,
    Filter,
    ArrowRight,
    TrendingUp,
    ArrowLeft,
    Share2,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function UnifiedBlog() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [selectedPost, setSelectedPost] = useState(null);
    const [postId, setPostId] = useState(null);

    // Get user info from Redux state
    const userID = useSelector(selectUserId);
    const userRole = useSelector(selectUserRole);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    // Fetch blog posts
    const {
        data: postsData,
        isLoading: postsLoading,
        error: postsError,
    } = useGetPublicBlogPostsQuery({
        category: selectedCategory === "all" ? undefined : selectedCategory,
        search: searchTerm || undefined,
    });

    // Fetch categories
    const { data: categoriesData, isLoading: categoriesLoading } =
        useGetCategoriesQuery();

    // Fetch specific post if viewing a single post
    const { data: postData, isLoading: isPostLoading, error: postError } =
        useGetBlogPostByIdQuery(postId, {
            skip: !postId,
        });

    // Extract data from API response (move this before useEffect hooks)
    const posts = postsData?.data?.posts || [];
    const categories = categoriesData?.categories || [];

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
                    console.error("Post not found for slug:", slug);
                }
            }
        } else if (!slug) {
            setSelectedPost(null);
            setPostId(null);
        }
    }, [slug, posts]);

    // Debug logging
    useEffect(() => {
        if (slug && postData) {
            console.log('Post data received:', postData);
            console.log('Post content structure:', postData.data?.content);
            console.log('Content type:', typeof postData.data?.content);
        }
        if (postError) {
            console.error('Post error:', postError);
        }
    }, [slug, postData, postError]);

    // Sort posts
    const sortedPosts = useMemo(() => {
        if (!posts.length) return [];

        const sorted = [...posts];
        switch (sortBy) {
            case "newest":
                return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            case "oldest":
                return sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            case "popular":
                return sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
            default:
                return sorted;
        }
    }, [posts, sortBy]);

    // Helper functions
    const getCategoryColor = (categorySlug) => {
        const category = categories.find((cat) => cat.slug === categorySlug);
        return category?.color || "#6b7280";
    };

    const getCategoryName = (categorySlug) => {
        const category = categories.find((cat) => cat.slug === categorySlug);
        return category?.name || categorySlug;
    };

    const getBlogPostUrl = (postSlug) => {
        // Use current context - if in dashboard, stay in dashboard
        if (location.pathname.includes('/dashboard/')) {
            return `/dashboard/${userRole}/${userID}/blog/${postSlug}`;
        }
        // Otherwise use public blog URLs
        return `/blog/${postSlug}`;
    };

    const getBlogListUrl = () => {
        // Use current context - if in dashboard, stay in dashboard
        if (location.pathname.includes('/dashboard/')) {
            return `/dashboard/${userRole}/${userID}/blog`;
        }
        // Otherwise use public blog URL
        return `/blog`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
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
        else if (content.type === 'doc' && content.content) {
            text = extractTextFromContent(content.content);
        }
        // Fallback
        else {
            text = JSON.stringify(content);
        }

        const words = text.split(/\s+/).filter(word => word.length > 0).length;
        const readTime = Math.ceil(words / wordsPerMinute);
        return `${readTime} min read`;
    };

    // Helper function to extract plain text from structured content
    const extractTextFromContent = (contentArray) => {
        if (!Array.isArray(contentArray)) return '';

        return contentArray.map(node => {
            if (node.type === 'text') {
                return node.text || '';
            } else if (node.content) {
                return extractTextFromContent(node.content);
            }
            return '';
        }).join(' ');
    };

    // Helper function to render structured content
    const renderContent = (content) => {
        if (!content) return '';

        // If it's already a string (HTML), return it directly
        if (typeof content === 'string') {
            return content;
        }

        // If it's a structured document (TipTap/ProseMirror format)
        if (content.type === 'doc' && content.content) {
            return renderDocumentContent(content.content);
        }

        // Fallback for other formats
        return JSON.stringify(content);
    };

    // Helper function to render document content recursively
    const renderDocumentContent = (contentArray) => {
        if (!Array.isArray(contentArray)) return '';

        return contentArray.map((node, index) => {
            switch (node.type) {
                case 'paragraph':
                    const paragraphContent = node.content ? renderDocumentContent(node.content) : '';
                    // Skip empty paragraphs
                    if (!paragraphContent.trim()) return '';
                    return `<p class="mb-4 text-gray-700 leading-relaxed">${paragraphContent}</p>`;

                case 'heading':
                    const level = node.attrs?.level || 1;
                    const headingContent = node.content ? renderDocumentContent(node.content) : '';
                    const headingClasses = {
                        1: 'text-3xl font-bold mb-6 mt-8 text-gray-900',
                        2: 'text-2xl font-semibold mb-4 mt-6 text-gray-800',
                        3: 'text-xl font-semibold mb-3 mt-5 text-gray-800',
                        4: 'text-lg font-semibold mb-2 mt-4 text-gray-700',
                        5: 'text-base font-semibold mb-2 mt-3 text-gray-700',
                        6: 'text-sm font-semibold mb-2 mt-2 text-gray-600'
                    };
                    return `<h${level} class="${headingClasses[level] || headingClasses[1]}">${headingContent}</h${level}>`;

                case 'text':
                    let text = node.text || '';
                    if (node.marks) {
                        node.marks.forEach(mark => {
                            switch (mark.type) {
                                case 'bold':
                                    text = `<strong class="font-semibold">${text}</strong>`;
                                    break;
                                case 'italic':
                                    text = `<em class="italic">${text}</em>`;
                                    break;
                                case 'link':
                                    text = `<a href="${mark.attrs?.href || '#'}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${text}</a>`;
                                    break;
                                case 'code':
                                    text = `<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">${text}</code>`;
                                    break;
                            }
                        });
                    }
                    return text;

                case 'bulletList':
                case 'bullet_list':
                    const listItems = node.content ? renderDocumentContent(node.content) : '';
                    return `<ul class="list-disc mb-4 space-y-1 ml-6 pl-2">${listItems}</ul>`;

                case 'orderedList':
                case 'ordered_list':
                    const orderedItems = node.content ? renderDocumentContent(node.content) : '';
                    return `<ol class="list-decimal mb-4 space-y-1 ml-6 pl-2">${orderedItems}</ol>`;

                case 'listItem':
                case 'list_item':
                    const itemContent = node.content ? renderDocumentContent(node.content) : '';
                    return `<li class="text-gray-700 leading-relaxed pl-2">${itemContent}</li>`;

                case 'blockquote':
                    const quoteContent = node.content ? renderDocumentContent(node.content) : '';
                    return `<blockquote class="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-50 italic text-gray-700">${quoteContent}</blockquote>`;

                case 'codeBlock':
                case 'code_block':
                    const codeContent = node.content ? renderDocumentContent(node.content) : '';
                    const language = node.attrs?.language || '';
                    return `<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4 overflow-x-auto"><code class="font-mono text-sm" ${language ? `data-language="${language}"` : ''}>${codeContent}</code></pre>`;

                case 'hardBreak':
                case 'hard_break':
                    return '<br class="mb-2">';

                case 'horizontalRule':
                case 'horizontal_rule':
                    return '<hr class="border-gray-300 my-8">';

                default:
                    // Log unknown types for debugging
                    console.log('Unknown content type:', node.type, node);
                    // For unknown types, try to render content if it exists
                    if (node.content) {
                        return renderDocumentContent(node.content);
                    }
                    return '';
            }
        }).join('');
    };

    const handleShare = async (post) => {
        const url = `${window.location.origin}${getBlogPostUrl(post.slug)}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: post.title,
                    text: post.excerpt,
                    url: url,
                });
            } catch (error) {
                console.log("Error sharing:", error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                toast.success("Link copied to clipboard!");
            } catch (error) {
                toast.error("Failed to copy link");
            }
        }
    };

    // If viewing a single post
    if (slug) {
        // Use selectedPost from the list first, then fallback to fetched postData
        const currentPost = selectedPost || postData?.data;

        if (isPostLoading && !selectedPost) {
            return (
                <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
                    <div className="container mx-auto px-4 py-8 max-w-4xl">
                        <div className="space-y-6">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-64 w-full" />
                            <div className="space-y-4">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (postError || (!currentPost && !isPostLoading)) {
            return (
                <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
                    <div className="container mx-auto px-4 py-8 max-w-4xl">
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
                </div>
            );
        }

        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
                <div className="container mx-auto px-4 py-8 max-w-4xl">
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
                            {currentPost.featured_image && (
                                <div className="w-full h-64 md:h-80 overflow-hidden">
                                    <img
                                        src={currentPost.featured_image}
                                        alt={currentPost.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="p-6 md:p-8">
                                {/* Category Badge */}
                                {currentPost.category && (
                                    <Badge
                                        className="mb-4"
                                        style={{
                                            backgroundColor: getCategoryColor(currentPost.category),
                                            color: "white",
                                        }}
                                    >
                                        {getCategoryName(currentPost.category)}
                                    </Badge>
                                )}

                                {/* Title */}
                                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                                    {currentPost.title}
                                </h1>

                                {/* Meta Information */}
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        <span>{currentPost.author?.name || "Anonymous"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{formatDate(currentPost.created_at)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span>{formatReadTime(currentPost.content)}</span>
                                    </div>
                                    {currentPost.views && (
                                        <div className="flex items-center gap-2">
                                            <Eye className="w-4 h-4" />
                                            <span>{currentPost.views} views</span>
                                        </div>
                                    )}
                                </div>

                                {/* Share Button */}
                                <div className="mb-6">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleShare(currentPost)}
                                        className="gap-2"
                                    >
                                        <Share2 className="w-4 h-4" />
                                        Share
                                    </Button>
                                </div>

                                <Separator className="mb-6" />

                                {/* Content */}
                                <div
                                    className="prose prose-lg max-w-none content-renderer"
                                    dangerouslySetInnerHTML={{ __html: renderContent(currentPost.content) }}
                                />

                                <style>{`
                  .content-renderer {
                    line-height: 1.7;
                  }
                  .content-renderer h1:first-child,
                  .content-renderer h2:first-child,
                  .content-renderer h3:first-child {
                    margin-top: 0;
                  }
                  .content-renderer ul ul,
                  .content-renderer ol ol,
                  .content-renderer ul ol,
                  .content-renderer ol ul {
                    margin-top: 0.5rem;
                    margin-bottom: 0.5rem;
                  }
                `}</style>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        );
    }

    // Blog listing view
    const featuredPost = sortedPosts[0];
    const regularPosts = sortedPosts.slice(1);

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Our Blog
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Discover insights, tips, and stories from our healthcare professionals
                    </p>
                </div>

                {/* Search and Filter Bar */}
                <div className="mb-8">
                    <Card className="p-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="Search articles..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div className="lg:w-48">
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem key={category.slug} value={category.slug}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Sort */}
                            <div className="lg:w-48">
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">Newest First</SelectItem>
                                        <SelectItem value="oldest">Oldest First</SelectItem>
                                        <SelectItem value="popular">Most Popular</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Loading State */}
                {postsLoading && (
                    <div className="space-y-6">
                        <Card className="overflow-hidden">
                            <div className="md:flex">
                                <Skeleton className="w-full md:w-1/2 h-64" />
                                <div className="p-6 md:w-1/2 space-y-4">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-8 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            </div>
                        </Card>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <Card key={i} className="overflow-hidden">
                                    <Skeleton className="w-full h-48" />
                                    <div className="p-4 space-y-3">
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-6 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Error State */}
                {postsError && (
                    <Card className="p-8 text-center">
                        <div className="space-y-4">
                            <div className="p-4 rounded-full bg-destructive/10 w-fit mx-auto">
                                <BookOpen className="w-8 h-8 text-destructive" />
                            </div>
                            <h3 className="text-xl font-semibold">Unable to Load Posts</h3>
                            <p className="text-muted-foreground">
                                We're having trouble loading the blog posts. Please try again later.
                            </p>
                            <Button onClick={() => window.location.reload()}>
                                Try Again
                            </Button>
                        </div>
                    </Card>
                )}

                {/* Content */}
                {!postsLoading && !postsError && (
                    <>
                        {/* No Results */}
                        {sortedPosts.length === 0 && (
                            <Card className="p-8 text-center">
                                <div className="space-y-4">
                                    <div className="p-4 rounded-full bg-muted w-fit mx-auto">
                                        <BookOpen className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-xl font-semibold">No Posts Found</h3>
                                    <p className="text-muted-foreground">
                                        No blog posts match your search criteria. Try adjusting your
                                        filters.
                                    </p>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSearchTerm("");
                                            setSelectedCategory("all");
                                        }}
                                    >
                                        Clear Filters
                                    </Button>
                                </div>
                            </Card>
                        )}

                        {/* Featured Post */}
                        {featuredPost && (
                            <Card className="overflow-hidden mb-8">
                                <div className="md:flex">
                                    {/* Image */}
                                    <div className="md:w-1/2">
                                        {featuredPost.featured_image ? (
                                            <img
                                                src={featuredPost.featured_image}
                                                alt={featuredPost.title}
                                                className="w-full h-64 md:h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-64 md:h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                                <BookOpen className="w-16 h-16 text-blue-500" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="md:w-1/2 p-6">
                                        <Badge className="mb-3" variant="secondary">
                                            Featured
                                        </Badge>

                                        {featuredPost.category && (
                                            <Badge
                                                className="mb-3 ml-2"
                                                style={{
                                                    backgroundColor: getCategoryColor(featuredPost.category),
                                                    color: "white",
                                                }}
                                            >
                                                {getCategoryName(featuredPost.category)}
                                            </Badge>
                                        )}

                                        <h2 className="text-2xl font-bold mb-3 text-gray-900">
                                            {featuredPost.title}
                                        </h2>

                                        <p className="text-gray-600 mb-4 line-clamp-3">
                                            {featuredPost.excerpt}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDate(featuredPost.created_at)}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {formatReadTime(featuredPost.content)}
                                                </div>
                                            </div>

                                            <Link to={getBlogPostUrl(featuredPost.slug)}>
                                                <Button className="gap-2">
                                                    Read More
                                                    <ArrowRight className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* Regular Posts Grid */}
                        {regularPosts.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {regularPosts.map((post) => (
                                    <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                        {/* Image */}
                                        <div className="aspect-video overflow-hidden">
                                            {post.featured_image ? (
                                                <img
                                                    src={post.featured_image}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                                    <BookOpen className="w-8 h-8 text-blue-500" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <CardContent className="p-4">
                                            {post.category && (
                                                <Badge
                                                    className="mb-2"
                                                    size="sm"
                                                    style={{
                                                        backgroundColor: getCategoryColor(post.category),
                                                        color: "white",
                                                    }}
                                                >
                                                    {getCategoryName(post.category)}
                                                </Badge>
                                            )}

                                            <h3 className="font-semibold mb-2 line-clamp-2 text-gray-900">
                                                {post.title}
                                            </h3>

                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                {post.excerpt}
                                            </p>

                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(post.created_at)}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-3 h-3" />
                                                    {formatReadTime(post.content)}
                                                </div>
                                            </div>

                                            <Link to={getBlogPostUrl(post.slug)} className="block mt-3">
                                                <Button variant="outline" size="sm" className="w-full">
                                                    Read More
                                                </Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
