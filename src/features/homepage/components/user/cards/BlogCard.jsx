import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookText, Clock, Eye, ArrowRight } from "lucide-react";
import { useGetPublicBlogPostsQuery } from "@/api/services/blogApi";

export default function BlogCard() {
  const { data, isLoading } = useGetPublicBlogPostsQuery({
    limit: 5,
  });

  const posts = data?.data?.posts || [];

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="h-[400px] w-full border-0 shadow-lg bg-gradient-to-br from-card to-muted/20 hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] backdrop-blur-sm flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="text-sm sm:text-base font-semibold text-foreground flex items-center gap-2">
          <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
            <BookText className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
          </div>
          <span className="hidden sm:inline">Latest Articles</span>
          <span className="sm:hidden">Articles</span>
        </CardTitle>
      </CardHeader>
      <ScrollArea className="flex-1">
        <CardContent className="p-3 sm:p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-6 sm:py-8">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary"></div>
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="block group"
                >
                  <div className="p-3 sm:p-4 rounded-lg bg-background/50 border border-border/50 hover:bg-background/70 transition-all duration-200 group-hover:shadow-md">
                    <div className="space-y-2 sm:space-y-3">
                      {/* Header with category and date */}
                      <div className="flex items-center justify-between gap-2">
                        <Badge
                          variant="secondary"
                          className="text-xs px-1.5 py-0.5"
                        >
                          {post.category
                            ?.replace("-", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase()) ||
                            "Health"}
                        </Badge>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(post.publishDate)}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="text-xs sm:text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h4>

                      {/* Excerpt */}
                      {post.excerpt && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}

                      {/* Meta info */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime || 5}m
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {post.views || 0}
                          </div>
                        </div>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-8 sm:py-12">
              <div className="p-3 sm:p-4 rounded-full bg-muted/50 mb-3 sm:mb-4">
                <BookText className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                No articles available
              </p>
              <p className="text-xs text-muted-foreground">
                Check back soon for health tips and insights
              </p>
            </div>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
