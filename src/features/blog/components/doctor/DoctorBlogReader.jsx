import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUserId } from "@/state/data/authSlice";
import { useGetPublicBlogPostsQuery, useGetBlogPostByIdQuery } from "@/api/services/blogApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Settings, Plus, Eye } from "lucide-react";
import { toast } from "sonner";

const DoctorBlogReader = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const navigate = useNavigate();
    const userID = useSelector(selectUserId);

    // Fetch all public posts for reading
    const {
        data: postsData,
        isLoading: isPostsLoading,
        error: postsError,
        refetch: refetchPosts,
    } = useGetPublicBlogPostsQuery({
        search: searchTerm || undefined,
        category: categoryFilter === "all" ? undefined : categoryFilter,
        limit: 20,
    });

    const posts = postsData?.data?.posts || [];

    const handlePostClick = (post) => {
        navigate(`/dashboard/doctor/${userID}/blog/${post.slug}`);
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const handleCategoryFilter = (value) => {
        setCategoryFilter(value);
    };

    // Doctor Action Bar Component
    const DoctorActionBar = () => (
        <Card className="mb-6">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <Eye className="h-5 w-5 text-blue-600" />
                            <h2 className="text-lg font-semibold text-gray-900">
                                Blog Reading View
                            </h2>
                        </div>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            Doctor Mode
                        </Badge>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/dashboard/doctor/${userID}/blog/management`)}
                            className="text-gray-600 border-gray-300 hover:bg-gray-50"
                        >
                            <Settings className="h-4 w-4 mr-2" />
                            Manage Posts
                        </Button>

                        <Button
                            size="sm"
                            onClick={() => navigate(`/dashboard/doctor/${userID}/blog/editor`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            New Post
                        </Button>
                    </div>
                </div>

                <div className="mt-4 text-sm text-gray-600">
                    <p>
                        📖 Reading all published blog posts. You can view your own posts and others' posts here.
                    </p>
                </div>
            </CardContent>
        </Card>
    );

    // Main component render
    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <DoctorActionBar />

            {/* Handle errors */}
            {postsError && (
                <div className="text-center">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-red-800 mb-2">
                            Error Loading Blog Posts
                        </h3>
                        <p className="text-red-600 mb-4">
                            Unable to load blog posts at this time. Please try again later.
                        </p>
                        <Button onClick={() => refetchPosts()} variant="destructive">
                            Retry
                        </Button>
                    </div>
                </div>
            )}

            {/* Handle loading state */}
            {isPostsLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-20 bg-gray-200 rounded"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Search and filters */}
            {!postsError && !isPostsLoading && (
                <>
                    <Card className="mb-6">
                        <CardContent className="p-4">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <Input
                                        placeholder="Search blog posts..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            handleSearch(e.target.value);
                                        }}
                                    />
                                </div>
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => {
                                        setCategoryFilter(e.target.value);
                                        handleCategoryFilter(e.target.value);
                                    }}
                                    className="px-3 py-2 border rounded-md"
                                >
                                    <option value="all">All Categories</option>
                                    <option value="health">Health</option>
                                    <option value="wellness">Wellness</option>
                                    <option value="spine-health">Spine Health</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Posts grid */}
                    {posts.length === 0 ? (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <h3 className="text-lg font-semibold mb-2">No blog posts found</h3>
                                <p className="text-gray-600">There are no published blog posts at the moment.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map((post) => (
                                <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                                    onClick={() => handlePostClick(post)}>
                                    <CardContent className="p-6">
                                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{post.title}</h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt || 'No excerpt available'}</p>
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                            <Badge variant="outline">{post.category || 'General'}</Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );    // List View Component
    const ListView = () => {
        // Handle errors
        if (postsError) {
            return (
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <DoctorActionBar />
                    <div className="text-center">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-red-800 mb-2">
                                Error Loading Blog Posts
                            </h3>
                            <p className="text-red-600 mb-4">
                                Unable to load blog posts at this time. Please try again later.
                            </p>
                            <Button onClick={() => refetchPosts()} variant="destructive">
                                Retry
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        // Handle loading state
        if (isPostsLoading) {
            return (
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <DoctorActionBar />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <Card key={i} className="animate-pulse">
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                        <div className="h-20 bg-gray-200 rounded"></div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <DoctorActionBar />

                {/* Search and filters */}
                <Card className="mb-6">
                    <CardContent className="p-4">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search blog posts..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        handleSearch(e.target.value);
                                    }}
                                />
                            </div>
                            <select
                                value={categoryFilter}
                                onChange={(e) => {
                                    setCategoryFilter(e.target.value);
                                    handleCategoryFilter(e.target.value);
                                }}
                                className="px-3 py-2 border rounded-md"
                            >
                                <option value="all">All Categories</option>
                                <option value="health">Health</option>
                                <option value="wellness">Wellness</option>
                                <option value="spine-health">Spine Health</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Posts grid */}
                {posts.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <h3 className="text-lg font-semibold mb-2">No blog posts found</h3>
                            <p className="text-gray-600">There are no published blog posts at the moment.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() => handlePostClick(post)}>
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{post.title}</h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt || 'No excerpt available'}</p>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                        <Badge variant="outline">{post.category || 'General'}</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // Main render - switch between views
    return view === "post" ? <PostView /> : <ListView />;
};

export default DoctorBlogReader;