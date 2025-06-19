import { useFetchPostsQuery } from "@/services/blogApi";
// import Render from "../RenderBlog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
export default function Blog() {
    const { data, isLoading } = useFetchPostsQuery();
    const posts = data?.metadata ?? data ?? [];

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h2 className="text-3xl font-semibold text-gray-900">From the Blog</h2>
                    <p className="mt-1 text-gray-600">Latest updates and insights.</p>

                </div>
                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="bg-white shadow rounded-md p-1">
                        <TabsTrigger value="all" className="flex-1 text-center">All Posts</TabsTrigger>
                        <TabsTrigger value="category1" className="flex-1 text-center">Category 1</TabsTrigger>
                        <TabsTrigger value="category2" className="flex-1 text-center">Category 2</TabsTrigger>
                    </TabsList>
                    <TabsContent value="all">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                            {isLoading ? (
                                <p>Loading...</p>
                            ) : posts.length > 0 ? (
                                posts.map((post) => (
                                    <div key={post.id || post.title} className="bg-white rounded-md shadow p-6">
                                        <h3 className="text-lg font-semibold text-gray-800">{post.title}</h3>
                                        {post.description && (
                                            <p className="mt-2 text-gray-600 text-sm">{post.description}</p>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>No blog posts available.</p>
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent value="category1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                            {/* Render posts for Category 1 */}
                            {posts.filter(post => post.category === 'Category 1').map((post) => (
                                <div key={post.id || post.title} className="bg-white rounded-md shadow p-6">
                                    <h3 className="text-lg font-semibold text-gray-800">{post.title}</h3>
                                    {post.description && (
                                        <p className="mt-2 text-gray-600 text-sm">{post.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>

            </div>
        </div>
    );
}