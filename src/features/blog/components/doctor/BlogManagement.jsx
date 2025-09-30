import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetBlogPostsQuery,
  useDeleteBlogPostMutation,
  useUpdateBlogPostMutation,
  usePublishBlogPostMutation,
} from "@/api/services/blogApi";












import { toast } from "sonner";

const BlogManagement = () => {
  const navigate = useNavigate();
  const { id: doctorId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deletePostId, setDeletePostId] = useState(null);
  const [draftSearchTerm, setDraftSearchTerm] = useState("");

  const getBlogPath = (path) => `/dashboard/doctor/${doctorId}/blog/${path}`;

  const {
    data: postsData,
    isLoading,
    error,
    refetch,
  } = useGetBlogPostsQuery({
    search: searchTerm || undefined,
    status: "published",
    category: categoryFilter === "all" ? undefined : categoryFilter,
  });

  const {
    data: draftsData,
    isLoading: isDraftsLoading,
    error: _draftsError,
    refetch: refetchDrafts,
  } = useGetBlogPostsQuery({
    search: draftSearchTerm || undefined,
    status: "draft",
    category: categoryFilter === "all" ? undefined : categoryFilter,
  });

  const [deletePost, { isLoading: isDeleting }] = useDeleteBlogPostMutation();
  const [updatePost, { isLoading: isUpdating }] = useUpdateBlogPostMutation();
  const [publishPost, { isLoading: isPublishing }] = usePublishBlogPostMutation();

  const posts = postsData?.data?.posts || [];
  const drafts = draftsData?.data?.posts || [];

  const handleDelete = async () => {
    if (!deletePostId) return;

    try {
      await deletePost(deletePostId).unwrap();
      toast.success("Blog post deleted successfully");
      setDeletePostId(null);
      refetch();
      refetchDrafts();
    } catch (error) {
      toast.error("Failed to delete blog post");
      console.error("Delete error:", error);
    }
  };

  const handlePublish = async (postId) => {
    try {
      await publishPost(postId).unwrap();
      toast.success("Post published successfully");
      refetch();
      refetchDrafts();
    } catch (error) {
      toast.error("Failed to publish post");
      console.error("Publish error:", error);
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
      refetchDrafts();
    } catch (error) {
      toast.error("Failed to update post status");
      console.error("Status update error:", error);
    }
  };

  //

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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
          <div className="h-32 bg-gray-200 rounded"></div>
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
              <h3 className="text-lg font-semibold mb-2">Error Loading Posts</h3>
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
    <div className="h-full w-full p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Blog Management</h1>
          <p className="text-lg text-muted-foreground mt-2">Create and manage your blog posts</p>
        </div>

      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Posts</p>
                <p className="text-3xl font-bold text-gray-900">{posts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Published</p>
                <p className="text-3xl font-bold text-gray-900">
                  {posts.filter((post) => post.is_published).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Drafts</p>
                <p className="text-3xl font-bold text-gray-900">
                  {drafts.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Views</p>
                <p className="text-3xl font-bold text-gray-900">
                  {posts.reduce((sum, post) => sum + (post.view_count || 0), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="published" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="published">Published Posts</TabsTrigger>
            <TabsTrigger value="drafts">Draft Posts</TabsTrigger>
          </TabsList>
          <Button onClick={() => navigate(getBlogPath("editor"))} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Create New Post
          </Button>
        </div>

        <TabsContent value="published">
          <Card className="shadow-md mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Search published posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 h-12 text-lg w-full"
                    />
                  </div>
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-[200px] h-12">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="chiropractic-care">Chiropractic Care</SelectItem>
                    <SelectItem value="spine-health">Spine Health</SelectItem>
                    <SelectItem value="pain-management">Pain Management</SelectItem>
                    <SelectItem value="wellness">Wellness & Prevention</SelectItem>
                    <SelectItem value="exercise">Exercise & Therapy</SelectItem>
                    <SelectItem value="nutrition">Nutrition & Lifestyle</SelectItem>
                    <SelectItem value="patient-stories">Patient Stories</SelectItem>
                    <SelectItem value="clinic-news">Clinic News</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="p-6">
              <CardTitle className="text-2xl">Published Posts</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading posts...</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold mb-3">No published posts found</h3>
                  <p className="text-gray-600 text-lg mb-6">
                    {searchTerm || categoryFilter !== "all"
                      ? "No published posts match your current filters."
                      : "You haven't published any blog posts yet."}
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="py-4 text-base">Title</TableHead>
                        <TableHead className="py-4 text-base">Category</TableHead>
                        <TableHead className="py-4 text-base">Published</TableHead>
                        <TableHead className="py-4 text-base">Updated</TableHead>
                        <TableHead className="py-4 text-base">Views</TableHead>
                        <TableHead className="w-[100px] py-4 text-base">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {posts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell className="py-4">
                            <div className="space-y-1">
                              <div className="font-medium text-base">{post.title}</div>
                              <div className="text-sm text-gray-500 line-clamp-2">
                                {post.excerpt}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge variant="outline" className="text-sm px-3 py-1">
                              {getCategoryLabel(post.category)}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-2" />
                              {formatDate(post.published_at || post.created_at)}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-2" />
                              {formatDate(post.updated_at)}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center text-sm text-gray-500">
                              <Eye className="h-4 w-4 mr-2" />
                              {post.view_count || 0}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => navigate(getBlogPath(`editor/${post.id}`))}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => navigate(getBlogPath(`post/${post.id}`))}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleStatusToggle(post.id, post.is_published)}
                                  disabled={isUpdating}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Unpublish
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
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drafts">
          <Card className="shadow-md mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Search draft posts..."
                      value={draftSearchTerm}
                      onChange={(e) => setDraftSearchTerm(e.target.value)}
                      className="pl-12 h-12 text-lg w-full"
                    />
                  </div>
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-[200px] h-12">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="chiropractic-care">Chiropractic Care</SelectItem>
                    <SelectItem value="spine-health">Spine Health</SelectItem>
                    <SelectItem value="pain-management">Pain Management</SelectItem>
                    <SelectItem value="wellness">Wellness & Prevention</SelectItem>
                    <SelectItem value="exercise">Exercise & Therapy</SelectItem>
                    <SelectItem value="nutrition">Nutrition & Lifestyle</SelectItem>
                    <SelectItem value="patient-stories">Patient Stories</SelectItem>
                    <SelectItem value="clinic-news">Clinic News</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="p-6">
              <CardTitle className="text-2xl">Draft Posts</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {isDraftsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading drafts...</p>
                </div>
              ) : drafts.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold mb-3">No draft posts found</h3>
                  <p className="text-gray-600 text-lg mb-6">
                    {draftSearchTerm || categoryFilter !== "all"
                      ? "No draft posts match your current filters."
                      : "You don't have any draft posts yet."}
                  </p>
                  <Button onClick={() => navigate(getBlogPath("editor"))} size="lg">
                    <Plus className="h-5 w-5 mr-2" />
                    Create Your First Draft
                  </Button>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="py-4 text-base">Title</TableHead>
                        <TableHead className="py-4 text-base">Category</TableHead>
                        <TableHead className="py-4 text-base">Created</TableHead>
                        <TableHead className="py-4 text-base">Updated</TableHead>
                        <TableHead className="py-4 text-base">Tags</TableHead>
                        <TableHead className="w-[100px] py-4 text-base">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {drafts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell className="py-4">
                            <div className="space-y-1">
                              <div className="font-medium text-base">{post.title}</div>
                              <div className="text-sm text-gray-500 line-clamp-2">
                                {post.excerpt}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge variant="outline" className="text-sm px-3 py-1">
                              {getCategoryLabel(post.category) || "Uncategorized"}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-2" />
                              {formatDate(post.created_at)}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-2" />
                              {formatDate(post.updated_at)}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex flex-wrap gap-1">
                              {post.tags && post.tags.length > 0 ? (
                                post.tags.slice(0, 2).map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-sm text-gray-400">No tags</span>
                              )}
                              {post.tags && post.tags.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{post.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => navigate(getBlogPath(`editor/${post.id}`))}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handlePublish(post.id)}
                                  disabled={isPublishing}
                                  className="text-green-600"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Publish
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
                </div>
              )}
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

export default BlogManagement; 
