import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { useFetchPostsQuery } from "@/services/blogApi";

export default function Blog() {
    const { data, isLoading } = useFetchPostsQuery();
    const posts = data?.metadata ?? data ?? [];

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-3xl font-semibold text-gray-900">From the Blog</h2>
                    <p className="mt-1 text-gray-600">Explore updates and insights from our experts.</p>
                </div>
                <Tabs defaultValue="account" className="w-[400px]">
                    <TabsList>
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="password">Password</TabsTrigger>
                    </TabsList>
                    <TabsContent value="account">Make changes to your account here.</TabsContent>
                    <TabsContent value="password">Change your password here.</TabsContent>
                </Tabs>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : posts.length > 0 ? (
                        posts.map((post) => (
                            <div key={post.id} className="bg-white shadow-sm rounded-lg p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div>
                                    <div className="flex items-center gap-x-2 text-sm text-gray-500 mb-2">
                                        <time dateTime={post.datetime}>{post.date}</time>
                                        {post.category && (
                                            <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-700">
                                                {post.category.title}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 hover:text-violet-600 transition-colors">
                                        <a href={post.href || '#'}>{post.title}</a>
                                    </h3>
                                    {post.description && (
                                        <p className="mt-3 text-sm text-gray-600 line-clamp-3">{post.description}</p>
                                    )}
                                </div>

                                {post.author && (
                                    <div className="mt-6 flex items-center gap-x-4">
                                        <img
                                            src={post.author.imageUrl}
                                            alt=""
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">{post.author.name}</p>
                                            <p className="text-sm text-gray-500">{post.author.role}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No blog posts available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}