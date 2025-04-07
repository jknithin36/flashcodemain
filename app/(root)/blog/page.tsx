"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Blog type
interface Blog {
  id: number;
  title: string;
  description: string;
  url: string;
  published_at: string;
  public_reactions_count: number;
  user: {
    name: string;
  };
  social_image: string;
}

const TAGS = ["technology", "nextjs", "reactjs", "javascript", "typescript"];

export default function TechBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filtered, setFiltered] = useState<Blog[]>([]);
  const [page, setPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState("technology");
  const [sortBy, setSortBy] = useState<"recent" | "trending">("recent");
  const blogsPerPage = 5;

  const fetchBlogs = async () => {
    try {
      const res = await fetch(
        `https://dev.to/api/articles?tag=${selectedTag}&per_page=50`
      );
      const data: Blog[] = await res.json();

      if (data.length === 0) {
        setBlogs([]);
        return;
      }

      const sorted =
        sortBy === "trending"
          ? data.sort(
              (a, b) => b.public_reactions_count - a.public_reactions_count
            )
          : data;

      setBlogs(sorted);
      setPage(1);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [selectedTag, sortBy]);

  useEffect(() => {
    const start = (page - 1) * blogsPerPage;
    const end = start + blogsPerPage;
    setFiltered(blogs.slice(start, end));
  }, [blogs, page]);

  return (
    <div className="px-6 py-12 max-w-4xl mx-auto text-gray-800 dark:text-white">
      <h1 className="text-4xl font-bold text-center mb-6 text-blue-900 dark:text-white font-playfair-display">
        FlashCode Tech Blogs
      </h1>

      {/* Sort Filter */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        {[
          { label: "Newest", value: "recent" },
          { label: "Popular", value: "trending" },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => setSortBy(option.value as "recent" | "trending")}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition shadow-sm border border-transparent ${
              sortBy === option.value
                ? "bg-indigo-100 text-indigo-800"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Tag Filter */}
      <div className="flex flex-wrap gap-4 justify-center mb-10">
        {TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`uppercase tracking-wide px-5 py-2 rounded-xl text-sm font-semibold transition shadow-sm border border-transparent ${
              selectedTag === tag
                ? "bg-indigo-100 text-indigo-800"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Blog Cards */}
      <div className="grid grid-cols-1 gap-8">
        {filtered.length > 0 ? (
          filtered.map((blog) => (
            <div
              key={blog.id}
              className="relative rounded-xl p-6 overflow-hidden bg-white dark:bg-gray-900 shadow-md border border-gray-200 dark:border-gray-800 transition-all hover:shadow-lg"
            >
              {/* Blue side bar and thunder icon */}
              <div className="absolute left-0 top-0 h-full w-2 bg-[#1e3a8a] rounded-s-xl"></div>
              <div className="absolute bottom-[-40px] right-[-50px] opacity-5 pointer-events-none">
                <Image
                  src="/thunder.svg"
                  alt="Thunder Icon"
                  width={400}
                  height={400}
                  className="dark:invert dark:brightness-200"
                />
              </div>

              <div className="flex flex-col gap-4 relative z-10">
                <img
                  src={blog.social_image || "/placeholder.png"}
                  alt={blog.title}
                  className="w-full h-52 object-cover rounded-md"
                />

                <h3 className="text-xl font-semibold text-blue-900 dark:text-white">
                  {blog.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                  {blog.description || "No summary provided."}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>By {blog.user.name}</span>
                  <span>
                    {new Date(blog.published_at).toLocaleDateString()}
                  </span>
                </div>

                <Link
                  href={blog.url}
                  target="_blank"
                  className="text-sm font-medium text-blue-700 dark:text-yellow-400 hover:underline mt-2"
                >
                  Read Full →
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 text-gray-600 dark:text-gray-400 text-lg font-medium">
            🎉 We’re done showing articles for now.
            <br />
            Please visit again soon to explore new content from amazing devs!
          </div>
        )}
      </div>

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="flex justify-center items-center gap-6 mt-12">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-5 py-2 rounded-md bg-gray-200 dark:bg-gray-800 text-sm text-black dark:text-white disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm font-semibold">Page {page}</span>

          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page * blogsPerPage >= blogs.length}
            className="px-5 py-2 rounded-md bg-gray-200 dark:bg-gray-800 text-sm text-black dark:text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
