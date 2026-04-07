"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { addHeroSlide, deleteHeroSlide, toggleHeroSlide, updateHeroMobileImage } from "@/lib/actions/hero";
import { uploadAdminImage } from "@/lib/admin-upload";

interface Slide {
  id: number;
  image_url: string;
  cloudinary_id: string;
  mobile_image_url: string | null;
  mobile_cloudinary_id: string | null;
  alt_text: string;
  is_active: boolean;
}

export default function AdminHeroPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadingMobileFor, setUploadingMobileFor] = useState<number | null>(null);
  const [altText, setAltText] = useState("");

  useEffect(() => {
    fetchSlides();
  }, []);

  async function fetchSlides() {
    const res = await fetch("/api/admin/hero");
    const data = await res.json();
    setSlides(data);
  }

  async function uploadToCloudinary(file: File, folder: string) {
    return uploadAdminImage(file, folder);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { url, publicId } = await uploadToCloudinary(file, "helia-wedding/hero");
      await addHeroSlide(url, publicId, altText || "Hero slide");
      setAltText("");
      await fetchSlides();
      toast.success("Hero image uploaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleMobileUpload(e: React.ChangeEvent<HTMLInputElement>, slideId: number) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMobileFor(slideId);
    try {
      const { url, publicId } = await uploadToCloudinary(file, "helia-wedding/hero/mobile");
      await updateHeroMobileImage(slideId, url, publicId);
      await fetchSlides();
      toast.success("Mobile hero image uploaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploadingMobileFor(null);
      e.target.value = "";
    }
  }

  async function handleDelete(slide: Slide) {
    if (!confirm("Delete this slide?")) return;
    if (slide.cloudinary_id) {
      await fetch("/api/admin/upload/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: slide.cloudinary_id }),
      });
    }
    if (slide.mobile_cloudinary_id) {
      await fetch("/api/admin/upload/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: slide.mobile_cloudinary_id }),
      });
    }
    await deleteHeroSlide(slide.id);
    await fetchSlides();
  }

  async function handleToggle(slide: Slide) {
    await toggleHeroSlide(slide.id, !slide.is_active);
    await fetchSlides();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Hero Slides</h1>
      <p className="text-sm text-gray-500 mt-1">Manage the homepage slideshow. Upload a desktop image and optionally a mobile-optimized version.</p>

      {/* Upload */}
      <div className="mt-6 bg-white border border-gray-200 p-4 sm:p-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Add New Slide</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Description (optional)"
            className="rounded-none flex-1"
          />
          <label className="cursor-pointer shrink-0">
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            <span className={`inline-flex items-center justify-center h-10 px-4 text-sm bg-charcoal text-white ${uploading ? "opacity-50 pointer-events-none" : "hover:bg-charcoal/90"} transition-colors cursor-pointer`}>
              {uploading ? "Uploading..." : "Upload Desktop Image"}
            </span>
          </label>
        </div>
        <p className="text-xs text-gray-400 mt-2">Recommended: landscape orientation, at least 1920px wide.</p>
      </div>

      {/* Slides list */}
      <div className="mt-6 space-y-4">
        {slides.map((slide) => (
          <div key={slide.id} className="bg-white border border-gray-200 p-4 sm:p-5">
            <div className="flex items-start gap-4">
              {/* Desktop preview */}
              <div className="shrink-0">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Desktop</p>
                <div className="relative w-32 h-20 bg-gray-100">
                  <Image src={slide.image_url} alt={slide.alt_text || ""} fill className="object-cover" />
                </div>
              </div>

              {/* Mobile preview */}
              <div className="shrink-0">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Mobile</p>
                {slide.mobile_image_url ? (
                  <div className="relative w-14 h-20 bg-gray-100">
                    <Image src={slide.mobile_image_url} alt={`${slide.alt_text || ""} mobile`} fill className="object-cover" />
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleMobileUpload(e, slide.id)}
                      className="hidden"
                    />
                    <div className="w-14 h-20 border border-dashed border-gray-300 flex items-center justify-center hover:border-gold transition-colors">
                      {uploadingMobileFor === slide.id ? (
                        <span className="text-[8px] text-gray-400">...</span>
                      ) : (
                        <span className="text-gray-400 text-lg">+</span>
                      )}
                    </div>
                  </label>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 truncate">{slide.alt_text || "No description"}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Switch checked={slide.is_active} onCheckedChange={() => handleToggle(slide)} />
                  <span className="text-xs text-gray-400">{slide.is_active ? "Active" : "Hidden"}</span>
                </div>
                {!slide.mobile_image_url && (
                  <p className="text-[10px] text-amber-500 mt-1">No mobile image — desktop image will be used on all devices</p>
                )}
              </div>

              {/* Delete */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(slide)}
                className="text-red-500 border-red-200 hover:bg-red-50 rounded-none text-xs shrink-0"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
        {slides.length === 0 && (
          <p className="text-sm text-gray-400 py-8 text-center">No hero slides yet. Upload one above.</p>
        )}
      </div>
    </div>
  );
}
