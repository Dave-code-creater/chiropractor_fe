import { useFetchPostsQuery } from "@/services/blogApi";

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
        </div>
    );
}