import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export function RenderBlog({ posts }) {
  // build category list
  const categories = useMemo(() => {
    const cats = new Set(posts.map((p) => p.category));
    return ["All", ...cats];
  }, [posts]);

  const [selected, setSelected] = useState("All");
  const filtered =
    selected === "All" ? posts : posts.filter((p) => p.category === selected);

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold mb-6">Latest Blog Posts</h1>

      {/* category dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="mb-8">
            Categories: {selected}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {categories.map((cat) => (
            <DropdownMenuItem key={cat} onSelect={() => setSelected(cat)}>
              {cat}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* grid of cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="group">
            <Card className="overflow-hidden">
              <div className="relative w-full h-48 bg-gray-100 group-hover:opacity-90 transition">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="px-4 pt-4">
                <CardTitle className="text-lg">{post.title}</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  {post.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
