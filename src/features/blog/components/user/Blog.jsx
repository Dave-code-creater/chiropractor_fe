import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectUserId,
  selectUserRole,
} from "@/state/data/authSlice";
import {
  useGetPublicBlogPostsQuery,
  useGetCategoriesQuery,
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
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Get user ID and role from Redux state
  const userID = useSelector(selectUserId);
  const userRole = useSelector(selectUserRole);

  // Fetch data
  const {
    data: postsData,
    isLoading: postsLoading,
    error: postsError,
  } = useGetPublicBlogPostsQuery({
    category: selectedCategory === "all" ? undefined : selectedCategory,
    search: searchTerm || undefined,
  });

  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategoriesQuery();

  // Extract data from API response
  const posts = postsData?.data?.posts || [];
  const categories = categoriesData?.categories || [];

  // Sort posts
  const sortedPosts = useMemo(() => {
    if (!posts.length) return [];

    const sorted = [...posts];
    switch (sortBy) {
      case "newest":
        return sorted.sort(
          (a, b) => new Date(b.publishDate) - new Date(a.publishDate),
        );
      case "oldest":
        return sorted.sort(
          (a, b) => new Date(a.publishDate) - new Date(b.publishDate),
        );
      case "popular":
        return sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
      case "likes":
        return sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      default:
        return sorted;
    }
  }, [posts, sortBy]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get category color
  const getCategoryColor = (categorySlug) => {
    const category = categories.find((cat) => cat.slug === categorySlug);
    return category?.color || "#6b7280";
  };

  // Get category name
  const getCategoryName = (categorySlug) => {
    const category = categories.find((cat) => cat.slug === categorySlug);
    return category?.name || categorySlug;
  };

  // Generate blog post URL based on user role
  const getBlogPostUrl = (postSlug) => {
    return `/dashboard/${userRole}/${userID}/blog/${postSlug}`;
  };

  // Featured post (latest)
  const featuredPost = sortedPosts[0];
  const regularPosts = sortedPosts.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50 border-border/50 focus:bg-background"
                />
              </div>

              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full sm:w-48 bg-background/50 border-border/50">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.slug}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-40 bg-background/50 border-border/50">
                <TrendingUp className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="popular">Most Viewed</SelectItem>
                <SelectItem value="likes">Most Liked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Categories Overview */}
        {!categoriesLoading && categories.length > 0 && (
          <div className="mb-8">
            <ScrollArea className="w-full whitespace-nowrap rounded-lg">
              <div className="flex gap-3 pb-2">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                  className="shrink-0"
                >
                  All Posts
                  <Badge variant="secondary" className="ml-2">
                    {posts.length}
                  </Badge>
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={
                      selectedCategory === category.slug ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category.slug)}
                    className="shrink-0"
                    style={{
                      backgroundColor:
                        selectedCategory === category.slug
                          ? category.color
                          : undefined,
                      borderColor: category.color,
                      color:
                        selectedCategory === category.slug
                          ? "white"
                          : category.color,
                    }}
                  >
                    {category.name}
                    <Badge variant="secondary" className="ml-2">
                      {category.postCount}
                    </Badge>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Loading State */}
        {postsLoading && (
          <div className="space-y-6">
            {/* Featured post skeleton */}
            <Card className="overflow-hidden">
              <div className="md:flex">
                <Skeleton className="w-full md:w-1/2 h-64" />
                <div className="p-6 md:w-1/2 space-y-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Regular posts skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
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
                We're having trouble loading the blog posts. Please try again
                later.
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
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">No Posts Found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? `No posts match your search for "${searchTerm}"`
                      : `No posts found in the selected category`}
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
              <Link to={getBlogPostUrl(featuredPost.slug)} className="block">
                <Card className="mb-8 overflow-hidden border-0 shadow-xl bg-gradient-to-r from-card to-muted/20 hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-[1.01]">
                  <div className="md:flex">
                    <div className="md:w-1/2 relative overflow-hidden">
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-primary/30" />
                      </div>
                      <Badge
                        className="absolute top-4 left-4"
                        style={{
                          backgroundColor: getCategoryColor(
                            featuredPost.category,
                          ),
                        }}
                      >
                        Featured
                      </Badge>
                    </div>
                    <div className="p-6 md:w-1/2 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            style={{
                              borderColor: getCategoryColor(
                                featuredPost.category,
                              ),
                              color: getCategoryColor(featuredPost.category),
                            }}
                          >
                            {getCategoryName(featuredPost.category)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(featuredPost.publishDate)}
                          </span>
                        </div>

                        <h2 className="text-2xl md:text-3xl font-bold leading-tight group-hover:text-primary transition-colors">
                          {featuredPost.title}
                        </h2>

                        <p className="text-muted-foreground leading-relaxed">
                          {featuredPost.excerpt}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {featuredPost.readTime} min read
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {featuredPost.views?.toLocaleString() || 0}
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {featuredPost.likes || 0}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={featuredPost.author?.avatar} />
                            <AvatarFallback>
                              {featuredPost.author?.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("") || "A"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">
                              {featuredPost.author?.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Author
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-primary">
                          <span className="text-sm font-medium">Read Article</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            )}

            {/* Regular Posts Grid */}
            {regularPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularPosts.map((post) => (
                  <Link key={post.id} to={getBlogPostUrl(post.slug)} className="block">
                    <Card
                      className="group overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card to-muted/20 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer h-full"
                    >
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative overflow-hidden">
                        <BookOpen className="w-12 h-12 text-primary/30" />
                        <Badge
                          className="absolute top-3 left-3 text-xs"
                          style={{
                            backgroundColor: getCategoryColor(post.category),
                          }}
                        >
                          {getCategoryName(post.category)}
                        </Badge>
                      </div>

                      <CardContent className="p-5 flex flex-col h-full">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{formatDate(post.publishDate)}</span>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {post.readTime}m
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {post.views || 0}
                              </div>
                            </div>
                          </div>

                          <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>

                          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                            {post.excerpt}
                          </p>

                          <div className="flex flex-wrap gap-1">
                            {post.tags?.slice(0, 3).map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={post.author?.avatar} />
                                <AvatarFallback className="text-xs">
                                  {post.author?.name
                                    ?.split(" ")
                                    .map((n) => n[0])
                                    .join("") || "A"}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">
                                {post.author?.name}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 text-primary group-hover:gap-2 transition-all">
                              <span className="text-sm font-medium">Read More</span>
                              <ArrowRight className="w-3 h-3" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
