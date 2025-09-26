import React, { useState, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    selectUserId,
    selectUserRole,
    selectIsAuthenticated,
} from "@/state/data/authSlice";
import { useGetPublicBlogPostsQuery } from "@/api/services/blogApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Search,
    Calendar,
    Clock,
    Eye,
    User,
    BookOpen,
    Filter,
    ArrowRight,
    TrendingUp,
    Share2,
    Bookmark,
    Heart,
} from "lucide-react";
import { toast } from "sonner";

const BLOG_CATEGORIES = [
    { value: "all", label: "All Categories" },
    { value: "chiropractic-care", label: "Chiropractic Care" },
    { value: "spine-health", label: "Spine Health" },
    { value: "pain-management", label: "Pain Management" },
    { value: "wellness", label: "Wellness & Prevention" },
    { value: "exercise", label: "Exercise & Therapy" },
    { value: "nutrition", label: "Nutrition & Lifestyle" },
    { value: "patient-stories", label: "Patient Stories" },
    { value: "clinic-news", label: "Clinic News" },
];

const BlogListing = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());

    const userID = useSelector(selectUserId);
    const userRole = useSelector(selectUserRole);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const {
        data: postsData,
        isLoading: postsLoading,
        error: postsError,
    } = useGetPublicBlogPostsQuery({
        category: selectedCategory === "all" ? undefined : selectedCategory,
        search: searchTerm || undefined,
    });

    const posts = postsData?.data?.posts || postsData?.results || [];

    const filteredPosts = useMemo(() => {
        let filtered = [...posts];

        if (searchTerm) {
            filtered = filtered.filter(
                (post) =>
                    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    post.tags?.some((tag) =>
                        tag.toLowerCase().includes(searchTerm.toLowerCase())
                    )
            );
        }

        if (selectedCategory !== "all") {
            filtered = filtered.filter((post) => post.category === selectedCategory);
        }

        switch (sortBy) {
        case "newest":
            filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
        case "oldest":
            filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            break;
        case "popular":
            filtered.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
            break;
        case "title":
            filtered.sort((a, b) => a.title.localeCompare(b.title));
            break;
        default:
            break;
        }

        return filtered;
    }, [posts, searchTerm, selectedCategory, sortBy]);

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
        let text = "";

        if (typeof content === "string") {
            text = content;
        } else if (typeof content === "object") {
            text = JSON.stringify(content);
        } else {
            return "1 min read";
        }

        const words = text.replace(/<[^>]*>/g, "").split(" ").filter(word => word.trim().length > 0).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} min read`;
    };

    const getCategoryColor = (categorySlug) => {
        const colors = {
            "chiropractic-care": "bg-blue-100 text-blue-800",
            "spine-health": "bg-green-100 text-green-800",
            "pain-management": "bg-red-100 text-red-800",
            "wellness": "bg-purple-100 text-purple-800",
            "exercise": "bg-orange-100 text-orange-800",
            "nutrition": "bg-yellow-100 text-yellow-800",
            "patient-stories": "bg-pink-100 text-pink-800",
            "clinic-news": "bg-gray-100 text-gray-800",
        };
        return colors[categorySlug] || "bg-gray-100 text-gray-800";
    };

    const getCategoryLabel = (categorySlug) => {
        const category = BLOG_CATEGORIES.find((cat) => cat.value === categorySlug);
        return category ? category.label : categorySlug;
    };

    const getBlogPostUrl = (post) => {
        if (location.pathname.includes("/dashboard/")) {
            return `/dashboard/${userRole}/${userID}/blog/post/${post.id}`;
        }
        return `/blog/post/${post.id}`;
    };

    const handleBookmark = (postId) => {
        const newBookmarks = new Set(bookmarkedPosts);
        if (newBookmarks.has(postId)) {
            newBookmarks.delete(postId);
            toast.success("Removed from bookmarks");
        } else {
            newBookmarks.add(postId);
            toast.success("Added to bookmarks");
        }
        setBookmarkedPosts(newBookmarks);
    };

    const handleShare = (post) => {
        const url = window.location.origin + getBlogPostUrl(post);
        if (navigator.share) {
            navigator.share({
                title: post.title,
                text: post.excerpt,
                url: url,
            });
        } else {
            navigator.clipboard.writeText(url);
            toast.success("Link copied to clipboard");
        }
    };

    if (postsLoading) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="space-y-6">
                    <div className="text-center">
                        <Skeleton className="h-12 w-64 mx-auto mb-4" />
                        <Skeleton className="h-6 w-96 mx-auto" />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Skeleton className="h-12 flex-1" />
                        <Skeleton className="h-12 w-48" />
                        <Skeleton className="h-12 w-48" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Card key={i} className="overflow-hidden">
                                <Skeleton className="h-48 w-full" />
                                <CardContent className="p-6">
                                    <Skeleton className="h-4 w-20 mb-3" />
                                    <Skeleton className="h-6 w-full mb-2" />
                                    <Skeleton className="h-6 w-3/4 mb-4" />
                                    <div className="flex justify-between">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (postsError) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <Card>
                    <CardContent className="p-12">
                        <div className="text-center">
                            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Unable to load blog posts</h3>
                            <p className="text-gray-600 mb-4">
                                There was an error loading the blog posts. Please try again later.
                            </p>
                            <Button onClick={() => window.location.reload()}>Try Again</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Health & Wellness Blog
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover expert insights on chiropractic care, wellness tips, and health advice
                        from our professional team.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Filter className="h-5 w-5 mr-2" />
                            Find Articles
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search articles..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div className="lg:w-64">
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {BLOG_CATEGORIES.map((category) => (
                                            <SelectItem key={category.value} value={category.value}>
                                                {category.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="lg:w-48">
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">Newest First</SelectItem>
                                        <SelectItem value="oldest">Oldest First</SelectItem>
                                        <SelectItem value="popular">Most Popular</SelectItem>
                                        <SelectItem value="title">Alphabetical</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {filteredPosts.length > 0 && (
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>
                            Showing {filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""}
                            {selectedCategory !== "all" && ` in ${getCategoryLabel(selectedCategory)}`}
                        </span>
                        <span>Updated regularly with new content</span>
                    </div>
                )}

                {filteredPosts.length === 0 && !postsLoading && (
                    <Card>
                        <CardContent className="p-12">
                            <div className="text-center">
                                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No articles found</h3>
                                <p className="text-gray-600 mb-4">
                                    {searchTerm || selectedCategory !== "all"
                                        ? "Try adjusting your search terms or filters."
                                        : "Check back soon for new articles."}
                                </p>
                                {(searchTerm || selectedCategory !== "all") && (
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSearchTerm("");
                                            setSelectedCategory("all");
                                        }}
                                    >
                                        Clear Filters
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {filteredPosts.length > 0 && (
                    <Card className="overflow-hidden">
                        <div className="md:flex">
                            <div className="md:w-1/2">
                                {filteredPosts[0].featured_image ? (
                                    <img
                                        src={filteredPosts[0].featured_image}
                                        alt={filteredPosts[0].title}
                                        className="w-full h-64 md:h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-64 md:h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                        <BookOpen className="w-12 h-12 text-blue-500" />
                                    </div>
                                )}
                            </div>

                            <div className="md:w-1/2 p-6 md:p-8">
                                <div className="flex items-center gap-2 mb-4">
                                    <TrendingUp className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm font-medium text-blue-600">Featured Article</span>
                                </div>

                                {filteredPosts[0].category && (
                                    <Badge className={`mb-4 ${getCategoryColor(filteredPosts[0].category)}`}>
                                        {getCategoryLabel(filteredPosts[0].category)}
                                    </Badge>
                                )}

                                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
                                    {filteredPosts[0].title}
                                </h2>

                                <p className="text-gray-600 mb-6 line-clamp-3">
                                    {filteredPosts[0].excerpt}
                                </p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {formatDate(filteredPosts[0].created_at)}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {formatReadTime(filteredPosts[0].content)}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Eye className="w-4 h-4" />
                                            {filteredPosts[0].view_count || 0} views
                                        </div>
                                    </div>

                                    <Link to={getBlogPostUrl(filteredPosts[0])}>
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

                {filteredPosts.length > 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.slice(1).map((post) => (
                            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                                <div className="aspect-video overflow-hidden">
                                    {post.featured_image ? (
                                        <img
                                            src={post.featured_image}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                            <BookOpen className="w-8 h-8 text-gray-400" />
                                        </div>
                                    )}
                                </div>

                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        {post.category && (
                                            <Badge className={getCategoryColor(post.category)} size="sm">
                                                {getCategoryLabel(post.category)}
                                            </Badge>
                                        )}

                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleBookmark(post.id)}
                                                className={`p-1 h-auto ${bookmarkedPosts.has(post.id) ? "text-yellow-500" : "text-gray-400"}`}
                                            >
                                                <Bookmark className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleShare(post)}
                                                className="p-1 h-auto text-gray-400 hover:text-gray-600"
                                            >
                                                <Share2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                        {post.title}
                                    </h3>

                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {post.excerpt}
                                    </p>

                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(post.created_at)}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {formatReadTime(post.content)}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Eye className="w-3 h-3" />
                                            {post.view_count || 0}
                                        </div>
                                    </div>

                                    <Link to={getBlogPostUrl(post)} className="block">
                                        <Button variant="outline" size="sm" className="w-full group-hover:bg-blue-50 group-hover:border-blue-200">
                                            Read Article
                                            <ArrowRight className="w-3 h-3 ml-1" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {filteredPosts.length > 12 && (
                    <div className="text-center">
                        <Button variant="outline" size="lg">
                            Load More Articles
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogListing;
