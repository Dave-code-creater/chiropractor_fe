import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetBlogPostsQuery,
  useDeleteBlogPostMutation,
  useUpdateBlogPostMutation,
} from "@/api/services/blogApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock,
  FileText,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  TrendingUp,
  Users,
  MessageSquare,
  Settings,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

const BlogOverview = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [authorFilter, setAuthorFilter] = useState("all");
  const [deletePostId, setDeletePostId] = useState(null);
  const [selectedPosts, setSelectedPosts] = useState(new Set());

  const {
    data: postsData,
    isLoading,
    error,
    refetch,
  } = useGetBlogPostsQuery({
    search: searchTerm || undefined,
    published: statusFilter === "all" ? undefined : statusFilter === "published",
    author: authorFilter === "all" ? undefined : authorFilter,
  });

  const [deletePost, { isLoading: isDeleting }] = useDeleteBlogPostMutation();
  const [updatePost, { isLoading: isUpdating }] = useUpdateBlogPostMutation();

  const posts = postsData?.results || [];

  const analytics = {
    totalPosts: posts.length,
    publishedPosts: posts.filter(p => p.is_published).length,
    draftPosts: posts.filter(p => !p.is_published).length,
    totalViews: posts.reduce((sum, post) => sum + (post.view_count || 0), 0),
    avgViews: posts.length > 0 ? Math.round(posts.reduce((sum, post) => sum + (post.view_count || 0), 0) / posts.length) : 0,
    topCategories: getTopCategories(posts),
    recentActivity: getRecentActivity(posts),
  };

  function getTopCategories(posts) {
    const categoryCount = {};
    posts.forEach(post => {
      if (post.category) {
        categoryCount[post.category] = (categoryCount[post.category] || 0) + 1;
      }
    });
    return Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }));
  }

  function getRecentActivity(posts) {
    return posts
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 5)
      .map(post => ({
        id: post.id,
        title: post.title,
        action: post.is_published ? 'published' : 'updated',
        timestamp: post.updated_at,
        author: post.author || 'Unknown'
      }));
  }

  const handleDelete = async () => {
    if (!deletePostId) return;

    try {
      await deletePost(deletePostId).unwrap();
      toast.success("Blog post deleted successfully");
      setDeletePostId(null);
      refetch();
    } catch (error) {
      toast.error("Failed to delete blog post");
      console.error("Delete error:", error);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedPosts.size === 0) {
      toast.error("Please select posts to perform bulk action");
      return;
    }

    try {
      const promises = Array.from(selectedPosts).map(postId => {
        switch (action) {
          case 'publish':
            return updatePost({ id: postId, is_published: true }).unwrap();
          case 'unpublish':
            return updatePost({ id: postId, is_published: false }).unwrap();
          case 'delete':
            return deletePost(postId).unwrap();
          default:
            return Promise.resolve();
        }
      });

      await Promise.all(promises);
      toast.success(`Bulk ${action} completed successfully`);
      setSelectedPosts(new Set());
      refetch();
    } catch (error) {
      toast.error(`Failed to perform bulk ${action}`);
      console.error("Bulk action error:", error);
    }
  };

  const handleStatusToggle = async (postId, currentStatus) => {
    try {
      await updatePost({
        id: postId,
        is_published: !currentStatus,
      }).unwrap();
      toast.success(`Post ${!currentStatus ? "published" : "unpublished"} successfully`);
      refetch();
    } catch (error) {
      toast.error("Failed to update post status");
      console.error("Status update error:", error);
    }
  };

  const getStatusBadge = (isPublished) => {
    if (isPublished) {
      return (
        <Badge variant="default" className="bg-green-500">
          <CheckCircle className="h-3 w-3 mr-1" />
          Published
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        <AlertCircle className="h-3 w-3 mr-1" />
        Draft
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryLabel = (category) => {
    const categories = {
      "chiropractic-care": "Chiropractic Care",
      "spine-health": "Spine Health",
      "pain-management": "Pain Management",
      "wellness": "Wellness & Prevention",
      "exercise": "Exercise & Therapy",
      "nutrition": "Nutrition & Lifestyle",
      "patient-stories": "Patient Stories",
      "clinic-news": "Clinic News",
    };
    return categories[category] || category;
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Blog Data</h3>
              <p className="text-gray-600 mb-4">
                Unable to load blog posts. Please try again.
              </p>
              <Button onClick={() => refetch()}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Blog Administration</h1>
          <p className="text-gray-600">Manage all blog content and monitor performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/blog/settings")}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button onClick={() => navigate("/blog/editor")}>
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="posts">All Posts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Posts</p>
                    <p className="text-2xl font-bold">{analytics.totalPosts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Published</p>
                    <p className="text-2xl font-bold">{analytics.publishedPosts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-8 w-8 text-yellow-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Drafts</p>
                    <p className="text-2xl font-bold">{analytics.draftPosts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Eye className="h-8 w-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Views</p>
                    <p className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{activity.title}</p>
                        <p className="text-xs text-gray-500">
                          {activity.action} by {activity.author}
                        </p>
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatDate(activity.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Top Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.topCategories.map((item) => (
                    <div key={item.category} className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {getCategoryLabel(item.category)}
                      </span>
                      <Badge variant="secondary">{item.count} posts</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="posts" className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={authorFilter} onValueChange={setAuthorFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by author" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Authors</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="doctor">Doctors</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedPosts.size > 0 && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium">
                    {selectedPosts.size} post(s) selected
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('publish')}
                  >
                    Publish
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('unpublish')}
                  >
                    Unpublish
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('delete')}
                    className="text-red-600"
                  >
                    Delete
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPosts(new Set())}
                  >
                    Clear
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Blog Posts</CardTitle>
            </CardHeader>
            <CardContent>
              {posts.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No posts found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || statusFilter !== "all" || authorFilter !== "all"
                      ? "No posts match your current filters."
                      : "No blog posts have been created yet."}
                  </p>
                  <Button onClick={() => navigate("/blog/editor")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Post
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <input
                          type="checkbox"
                          checked={selectedPosts.size === posts.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPosts(new Set(posts.map(p => p.id)));
                            } else {
                              setSelectedPosts(new Set());
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedPosts.has(post.id)}
                            onChange={(e) => {
                              const newSelected = new Set(selectedPosts);
                              if (e.target.checked) {
                                newSelected.add(post.id);
                              } else {
                                newSelected.delete(post.id);
                              }
                              setSelectedPosts(newSelected);
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{post.title}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {post.excerpt}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarFallback className="text-xs">
                                {(post.author || 'U')[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{post.author || 'Unknown'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getCategoryLabel(post.category)}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(post.is_published)}</TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-gray-500">
                            <Eye className="h-4 w-4 mr-1" />
                            {post.view_count || 0}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-500">
                            {formatDate(post.created_at)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => navigate(`/blog/editor/${post.id}`)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => navigate(`/blog/post/${post.id}`)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusToggle(post.id, post.is_published)}
                                disabled={isUpdating}
                              >
                                {post.is_published ? (
                                  <>
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Unpublish
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Publish
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setDeletePostId(post.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Blog Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Performance Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Average Views per Post</span>
                      <span className="font-medium">{analytics.avgViews}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Publication Rate</span>
                      <span className="font-medium">
                        {analytics.totalPosts > 0 ? Math.round((analytics.publishedPosts / analytics.totalPosts) * 100) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Categories</span>
                      <span className="font-medium">{analytics.topCategories.length}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Content Distribution</h4>
                  <div className="space-y-2">
                    {analytics.topCategories.map((item) => (
                      <div key={item.category} className="flex justify-between">
                        <span className="text-sm">{getCategoryLabel(item.category)}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(item.count / analytics.totalPosts) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-500">{item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BlogOverview; 
