"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Video { id: number; title: string; embed_url: string; category: string }

export default function VideosAdmin({ videos }: { videos: Video[] }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("wedding");
  const router = useRouter();

  async function handleAdd() {
    await fetch("/api/admin/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, embed_url: url, category }),
    });
    setTitle(""); setUrl("");
    router.refresh();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this video?")) return;
    await fetch(`/api/admin/videos?id=${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <>
      <div className="mt-6 bg-white border border-gray-200 p-4 sm:p-6 max-w-2xl space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Add Video</h3>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Video title" className="rounded-none" />
        <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="YouTube or Vimeo embed URL" className="rounded-none" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-10 px-3 border border-gray-200 text-sm bg-white">
          <option value="wedding">Wedding</option>
          <option value="prewedding">Pre-Wedding</option>
          <option value="event">Event</option>
        </select>
        <Button onClick={handleAdd} disabled={!title || !url} className="bg-charcoal text-white rounded-none text-xs">Add Video</Button>
      </div>

      <div className="mt-6 space-y-3">
        {videos.map((v) => (
          <div key={v.id} className="bg-white border border-gray-200 p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900">{v.title}</p>
              <p className="text-xs text-gray-400 truncate">{v.embed_url}</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => handleDelete(v.id)} className="rounded-none text-xs text-red-500 border-red-200 shrink-0">Delete</Button>
          </div>
        ))}
        {videos.length === 0 && <p className="text-sm text-gray-400 py-8 text-center">No videos yet.</p>}
      </div>
    </>
  );
}
