"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addPortfolioItem, deletePortfolioItem, toggleFeatured, addCategory } from "@/lib/actions/portfolio";

interface PortfolioAdminProps {
  items: Array<{
    id: number;
    image_url: string;
    cloudinary_id: string;
    title: string;
    category_name: string;
    category_id: number;
    is_featured: boolean;
    width: number;
    height: number;
  }>;
  categories: Array<{ id: number; name: string; slug: string }>;
}

export default function PortfolioAdmin({ items, categories }: PortfolioAdminProps) {
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [newCatName, setNewCatName] = useState("");
  const router = useRouter();

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);
      formData.append("folder", "helia-wedding/portfolio");

      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const { url, publicId, width, height } = await res.json();
      await addPortfolioItem(url, publicId, width, height, selectedCategory, title);
    }
    setTitle("");
    setUploading(false);
    router.refresh();
  }

  async function handleDelete(item: { id: number; cloudinary_id: string }) {
    if (!confirm("Delete this photo?")) return;
    if (item.cloudinary_id) {
      await fetch("/api/admin/upload/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: item.cloudinary_id }),
      });
    }
    await deletePortfolioItem(item.id);
    router.refresh();
  }

  async function handleAddCategory() {
    if (!newCatName.trim()) return;
    const slug = newCatName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    await addCategory(newCatName, slug);
    setNewCatName("");
    router.refresh();
  }

  return (
    <>
      {/* Add Category */}
      <div className="mt-6 bg-white border border-gray-200 p-4 sm:p-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {categories.map((cat) => (
            <span key={cat.id} className="px-3 py-1 bg-gray-100 text-xs text-gray-600">
              {cat.name}
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="New category name"
            className="rounded-none flex-1 max-w-xs"
          />
          <Button onClick={handleAddCategory} variant="outline" className="rounded-none text-xs">
            Add Category
          </Button>
        </div>
      </div>

      {/* Upload */}
      <div className="mt-4 bg-white border border-gray-200 p-4 sm:p-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Upload Photos</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Photo title (optional)"
            className="rounded-none"
          />
          <select
            value={selectedCategory || ""}
            onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
            className="h-10 px-3 border border-gray-200 text-sm bg-white"
          >
            <option value="">No category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <label className="cursor-pointer shrink-0">
            <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
            <span className={`inline-flex items-center justify-center h-10 px-4 text-sm bg-charcoal text-white ${uploading ? "opacity-50 pointer-events-none" : "hover:bg-charcoal/90"} transition-colors cursor-pointer w-full sm:w-auto`}>
              {uploading ? "Uploading..." : "Upload"}
            </span>
          </label>
        </div>
      </div>

      {/* Photos Grid */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {items.map((item) => (
          <div key={item.id} className="relative group bg-gray-100 aspect-square">
            <Image src={item.image_url} alt={item.title || ""} fill className="object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button
                onClick={() => toggleFeatured(item.id, !item.is_featured)}
                className={`p-1.5 text-xs ${item.is_featured ? "bg-gold text-white" : "bg-white text-gray-700"}`}
                title="Toggle featured"
              >
                ★
              </button>
              <button
                onClick={() => handleDelete(item)}
                className="p-1.5 bg-red-500 text-white text-xs"
                title="Delete"
              >
                ✕
              </button>
            </div>
            {item.is_featured && (
              <div className="absolute top-1 right-1 w-4 h-4 bg-gold text-white text-[8px] flex items-center justify-center">
                ★
              </div>
            )}
            {item.category_name && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-2 py-1 truncate">
                {item.category_name}
              </div>
            )}
          </div>
        ))}
        {items.length === 0 && (
          <p className="col-span-full text-center text-gray-400 py-12">No photos yet. Upload some above.</p>
        )}
      </div>
    </>
  );
}
