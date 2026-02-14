"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const router = useRouter();

  // ✅ STEP 10: Get user
  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  };


const fetchBookmarks = async () => {
  if (!user) return;

  const { data } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  setBookmarks(data);
};


  // ✅ STEP 11: Add bookmark
  const addBookmark = async () => {
    if (!user) {
      console.log("User not ready");
      return;
    }

    const { data, error } = await supabase.from("bookmarks").insert([
      {
        title,
        url,
        user_id: user.id,
      },
    ]);

    console.log("Insert result:", data);
    console.log("Insert error:", error);

    setTitle("");
    setUrl("");
    fetchBookmarks();
  };

  // ✅ STEP 13: Delete bookmark
  const deleteBookmark = async (bookmarkId) => {
    if (!user) return;

    const { data, error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", bookmarkId)
      .eq("user_id", user.id);

    console.log("Deleted data:", data);
    console.log("Delete error:", error);

    fetchBookmarks();
  };

  // ✅ STEP 15: Logout
  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  // ✅ STEP 14: Realtime
  // 1️⃣ Load user first
useEffect(() => {
  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  loadUser();
}, []);


// 2️⃣ Realtime subscription AFTER user exists
useEffect(() => {
  if (!user) return;

  // fetch only this user's bookmarks
  const fetchUserBookmarks = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setBookmarks(data);
  };

  fetchUserBookmarks();

  const channel = supabase
    .channel("bookmarks-realtime")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "bookmarks",
        filter: `user_id=eq.${user.id}`, // 🔥 IMPORTANT
      },
      (payload) => {
        console.log("Realtime event:", payload);
        fetchUserBookmarks();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };

}, [user]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white px-6 py-10">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        <button
          onClick={logout}
          className="bg-white/10 border border-white/20 px-4 py-2 rounded-xl hover:bg-white/20 transition"
        >
          Logout
        </button>
      </div>

      {/* Add Bookmark Card */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-10 max-w-3xl">
        <h2 className="text-lg font-semibold mb-4 text-gray-200">
          Add New Bookmark
        </h2>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            placeholder="Bookmark Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <input
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <button
            onClick={addBookmark}
            className="bg-white text-black font-semibold px-6 py-3 rounded-xl hover:bg-gray-200 transition"
          >
            Add
          </button>
        </div>
      </div>

      {/* Bookmark Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {bookmarks.length === 0 && (
          <div className="col-span-full text-center py-20 text-gray-400">
            <p className="text-lg">No bookmarks yet</p>
            <p className="text-sm mt-2 opacity-70">
              Add your first bookmark to get started 🚀
            </p>
          </div>
        )}

        {bookmarks.map((b) => (
          <div
            key={b.id}
            className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
          >
            {/* Title */}
            <h3 className="text-lg font-semibold text-white mb-2 truncate">
              {b.title}
            </h3>

            {/* URL */}
            <p className="text-gray-400 text-sm break-words mb-6 line-clamp-2">
              {b.url}
            </p>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <a
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-blue-400 hover:text-blue-300 transition"
              >
                Visit →
              </a>

              <button
                onClick={() => deleteBookmark(b.id)}
                className="text-sm px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition"
              >
                Delete
              </button>
            </div>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
