"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import UserAvatar from "@/components/UserAvatar";
import { Tag, HelpCircle, MessageCircle } from "lucide-react";

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length < 3) {
      setOpen(false);
      setResults(null);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => handleSearch(), 400);
  }, [query, filter]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&type=${filter}`
      );
      const data = await res.json();
      setResults(data);
      setOpen(true);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type: string, item?: any) => {
    switch (type) {
      case "question":
        return (
          <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        );
      case "answer":
        return (
          <MessageCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
        );
      case "user":
        return (
          <UserAvatar
            id={item._id}
            name={item.username || item.name}
            imageUrl={item.imageUrl}
            className="h-6 w-6"
          />
        );
      case "tag":
        return <Tag className="w-5 h-5 text-pink-500 dark:text-pink-400" />;
      default:
        return null;
    }
  };

  const handleItemClick = (type: string, id: string, questionId?: string) => {
    switch (type) {
      case "questions":
        router.push(`/questions/${id}`);
        break;
      case "answers":
        router.push(`/questions/${questionId}#answer-${id}`);
        break;
      case "users":
        router.push(`/profile/${id}`);
        break;
      case "tags":
        router.push(`/flash-tags/${id}`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="flex items-center gap-3 px-5 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-md">
        <Image
          src="/icons/search.svg"
          width={20}
          height={20}
          alt="Search Icon"
        />
        <input
          type="text"
          placeholder="Search globally"
          className="flex-1 bg-transparent outline-none text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-base font-medium"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {open && (
        <div
          ref={containerRef}
          className="absolute mt-3 w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden z-50"
        >
          <div className="flex gap-3 flex-wrap px-4 py-3 border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
            {["all", "question", "answer", "user", "tag"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition ${
                  filter === type
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-700">
            {loading && (
              <p className="p-4 text-sm text-zinc-500 dark:text-zinc-400">
                Searching...
              </p>
            )}
            {!loading &&
              results &&
              Object.entries(results).map(
                ([section, items]: [string, any]) =>
                  items.length > 0 && (
                    <div key={section}>
                      <h4 className="px-4 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-zinc-50 dark:bg-zinc-800 capitalize">
                        {section}
                      </h4>
                      {items.map((item: any) => (
                        <div
                          key={item._id}
                          onClick={() =>
                            handleItemClick(section, item._id, item.questionId)
                          }
                          className="flex gap-3 items-center px-4 py-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          {getIcon(section.slice(0, -1), item)}
                          <span className="text-sm text-zinc-700 dark:text-zinc-200 truncate">
                            {item.title ||
                              item.content ||
                              item.username ||
                              item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )
              )}

            {results && Object.values(results).flat().length === 0 && (
              <p className="p-4 text-sm text-zinc-500 dark:text-zinc-400">
                No results found.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
