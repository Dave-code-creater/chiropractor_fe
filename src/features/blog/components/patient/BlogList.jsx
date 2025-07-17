import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useGetPublicBlogPostsQuery } from "@/api/services/blogApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Heart,
  User,
  Tag,
  BookOpen,
  Filter,
  ArrowRight,
  TrendingUp,
  Star,
  Bookmark,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

const PATIENT_CATEGORIES = [
  { value: "all", label: "All Articles", icon: "📚" },
  { value: "pain-management", label: "Pain Management", icon: "🩹" },
  { value: "spine-health", label: "Spine Health", icon: "🦴" },
  { value: "wellness", label: "Wellness Tips", icon: "🌟" },
  { value: "exercise", label: "Exercise & Therapy", icon: "💪" },
  { value: "nutrition", label: "Nutrition & Lifestyle", icon: "🥗" },
  { value: "patient-stories", label: "Patient Stories", icon: "👥" },
];

const BlogList = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());

  // Fetch published posts only
  const {
    data: postsData,
    isLoading: postsLoading,
    error: postsError,
  } = useGetPublicBlogPostsQuery({
    category: selectedCategory === "all" ? undefined : selectedCategory,
    search: searchTerm || undefined,
  });

  const posts = postsData?.data?.posts || [];

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags?.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case "popular":
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return filtered;
  }, [posts, searchTerm, sortBy]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryColor = (categorySlug) => {
    const colors = {
      "pain-management": "bg-red-100 text-red-800",
      "spine-health": "bg-blue-100 text-blue-800",
      "wellness": "bg-green-100 text-green-800",
      "exercise": "bg-purple-100 text-purple-800",
      "nutrition": "bg-yellow-100 text-yellow-800",
      "patient-stories": "bg-pink-100 text-pink-800",
      "chiropractic-care": "bg-indigo-100 text-indigo-800",
      "clinic-news": "bg-gray-100 text-gray-800",
    };
    return colors[categorySlug] || "bg-gray-100 text-gray-800";
  };

  const getCategoryName = (categorySlug) => {
    const category = PATIENT_CATEGORIES.find(cat => cat.value === categorySlug);
    return category ? category.label : categorySlug;
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
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.origin + `/blog/post/${post.id}`,
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + `/blog/post/${post.id}`);
      toast.success("Link copied to clipboard");
    }
  };

  const getReadingTime = (content) => {
    const wordsPerMinute = 200;
    const words = content?.replace(/<[^>]*>/g, '').split(' ').length || 0;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (postsLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (postsError) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Unable to load articles</h3>
              <p className="text-gray-600">
                Please try again later or contact support if the problem persists.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Health & Wellness Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Expert advice and insights to help you on your journey to better health
            </p>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search health articles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="title">Alphabetical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Featured/Popular Posts */}
          {filteredPosts.length > 0 && (
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Featured Article
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    {filteredPosts[0].featured_image && (
                      <img
                        src={filteredPosts[0].featured_image}
                        alt={filteredPosts[0].title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    )}
                  </div>
                  <div className="space-y-3">
                    <Badge className={getCategoryColor(filteredPosts[0].category)}>
                      {getCategoryName(filteredPosts[0].category)}
                    </Badge>
                    <h3 className="text-2xl font-bold">
                      <Link
                        to={`/blog/post/${filteredPosts[0].id}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {filteredPosts[0].title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 line-clamp-3">
                      {filteredPosts[0].excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(filteredPosts[0].created_at)}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {getReadingTime(filteredPosts[0].content)}
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {filteredPosts[0].views || 0} views
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Blog Posts */}
          <div className="space-y-6">
            {filteredPosts.length === 0 ? (
              <Card>
                <CardContent className="p-12">
                  <div className="text-center">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No articles found</h3>
                    <p className="text-gray-600">
                      Try adjusting your search terms or browse different categories.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredPosts.slice(1).map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {post.featured_image && (
                        <div className="md:col-span-1">
                          <img
                            src={post.featured_image}
                            alt={post.title}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <div className={`space-y-3 ${post.featured_image ? 'md:col-span-3' : 'md:col-span-4'}`}>
                        <div className="flex items-center justify-between">
                          <Badge className={getCategoryColor(post.category)}>
                            {getCategoryName(post.category)}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleBookmark(post.id)}
                              className={bookmarkedPosts.has(post.id) ? "text-yellow-500" : ""}
                            >
                              <Bookmark className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleShare(post)}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold">
                          <Link
                            to={`/blog/post/${post.id}`}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {post.title}
                          </Link>
                        </h3>
                        
                        <p className="text-gray-600 line-clamp-2">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(post.created_at)}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {getReadingTime(post.content)}
                            </span>
                            <span className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {post.views || 0} views
                            </span>
                          </div>
                          
                          <Link to={`/blog/post/${post.id}`}>
                            <Button variant="outline" size="sm">
                              Read More
                              <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                          </Link>
                        </div>
                        
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Browse by Topic
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {PATIENT_CATEGORIES.map((category) => (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.value)}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Popular Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Popular Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {[
                  "Back Pain",
                  "Neck Pain",
                  "Posture",
                  "Exercise",
                  "Wellness",
                  "Nutrition",
                  "Recovery",
                  "Prevention",
                ].map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => setSearchTerm(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Health Tip */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800">
                <Star className="h-5 w-5 mr-2" />
                Health Tip
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-700">
                Remember to maintain good posture throughout the day. Take regular breaks 
                from sitting and perform gentle stretches to keep your spine healthy!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BlogList; 