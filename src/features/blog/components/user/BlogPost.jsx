import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useGetBlogPostByIdQuery } from "@/api/services/blogApi";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Heart,
  Share2,
  BookOpen,
  Tag,
  User,
} from "lucide-react";
import { toast } from "sonner";

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: postData, isLoading, error } = useGetBlogPostByIdQuery(slug);

  const post = postData;

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Handle share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {

      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      } catch (error) {
        toast.error("Failed to copy link");
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-6">
            <Skeleton className="h-10 w-32" />
            <Card className="overflow-hidden">
              <Skeleton className="w-full h-64" />
              <div className="p-6 space-y-4">
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </div>
            </Card>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/blog")}
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
                  The blog post you're looking for doesn't exist or has been
                  removed.
                </p>
                <Button asChild>
                  <Link to="/blog">Browse All Posts</Link>
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
          {/* Back Navigation */}
          <Button
            variant="ghost"
            onClick={() => navigate("/blog")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Button>

          {/* Article Header */}
          <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-r from-card to-muted/20">
            {/* Featured Image Placeholder */}
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
              <BookOpen className="w-20 h-20 text-primary/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            <CardContent className="p-8">
              <div className="space-y-6">
                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-3">
                  <Badge
                    className="text-sm"
                    style={{ backgroundColor: "#10b981" }}
                  >
                    {post.category
                      ?.replace("-", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase()) ||
                      "Health Tips"}
                  </Badge>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(post.publishDate)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime} min read
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {post.views?.toLocaleString() || 0} views
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {post.likes || 0} likes
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                  {post.title}
                </h1>

                {/* Excerpt */}
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Author and Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={post.author?.avatar} />
                      <AvatarFallback>
                        {post.author?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{post.author?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Healthcare Professional
                      </p>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Article Content */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/10">
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground">
                {/* Convert content to HTML-like structure */}
                {post.content?.split("\n\n").map((paragraph, index) => {
                  if (paragraph.startsWith("## ")) {
                    return (
                      <h2
                        key={index}
                        className="text-2xl font-bold mt-8 mb-4 text-foreground"
                      >
                        {paragraph.replace("## ", "")}
                      </h2>
                    );
                  } else if (paragraph.startsWith("### ")) {
                    return (
                      <h3
                        key={index}
                        className="text-xl font-semibold mt-6 mb-3 text-foreground"
                      >
                        {paragraph.replace("### ", "")}
                      </h3>
                    );
                  } else if (paragraph.startsWith("- ")) {
                    const items = paragraph
                      .split("\n")
                      .filter((item) => item.startsWith("- "));
                    return (
                      <ul key={index} className="list-disc pl-6 space-y-2 my-4">
                        {items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-muted-foreground">
                            {item.replace("- ", "")}
                          </li>
                        ))}
                      </ul>
                    );
                  } else if (paragraph.match(/^\d+\./)) {
                    const items = paragraph
                      .split("\n")
                      .filter((item) => item.match(/^\d+\./));
                    return (
                      <ol
                        key={index}
                        className="list-decimal pl-6 space-y-2 my-4"
                      >
                        {items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-muted-foreground">
                            {item.replace(/^\d+\.\s/, "")}
                          </li>
                        ))}
                      </ol>
                    );
                  } else if (paragraph.trim()) {
                    return (
                      <p
                        key={index}
                        className="text-muted-foreground leading-relaxed mb-4"
                      >
                        {paragraph}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/10">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Tag className="w-4 h-4" />
                    Tags
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Author Bio */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/10">
            <CardContent className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">About the Author</h3>
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={post.author?.avatar} />
                    <AvatarFallback>
                      {post.author?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">
                      {post.author?.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Healthcare Professional & Medical Writer
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {post.author?.name} is a licensed healthcare professional
                      with years of experience in patient care and medical
                      education. They specialize in creating accessible health
                      content to help patients make informed decisions about
                      their wellness journey.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button variant="outline" asChild>
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                All Posts
              </Link>
            </Button>
            <Button onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share Article
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
