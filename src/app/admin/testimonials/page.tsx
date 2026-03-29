"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import StarRating from "@/components/star-rating";
import { addTestimonial, updateTestimonial, deleteTestimonial } from "@/lib/actions/testimonials";
import { deleteReview } from "@/lib/actions/reviews";

interface TestimonialData {
  id: number;
  client_name: string;
  quote: string;
  event_type: string;
  is_featured: boolean;
}

interface ReviewData {
  id: number;
  client_name: string;
  rating: number;
  review_text: string;
  event_type: string | null;
  created_at: string;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [activeTab, setActiveTab] = useState<"reviews" | "testimonials">("reviews");
  const [editing, setEditing] = useState<TestimonialData | null>(null);
  const [name, setName] = useState("");
  const [quote, setQuote] = useState("");
  const [eventType, setEventType] = useState("Wedding");
  const [featured, setFeatured] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/testimonials").then((r) => r.json()).then(setTestimonials);
    fetch("/api/admin/reviews").then((r) => r.json()).then(setReviews);
  }, []);

  async function handleSaveTestimonial() {
    if (editing) {
      await updateTestimonial(editing.id, name, quote, eventType, featured);
    } else {
      await addTestimonial(name, quote, eventType, featured);
    }
    resetForm();
    const res = await fetch("/api/admin/testimonials");
    setTestimonials(await res.json());
    router.refresh();
  }

  async function handleDeleteTestimonial(id: number) {
    if (!confirm("Delete this testimonial?")) return;
    await deleteTestimonial(id);
    const res = await fetch("/api/admin/testimonials");
    setTestimonials(await res.json());
    router.refresh();
  }

  async function handleDeleteReview(id: number) {
    if (!confirm("Delete this review?")) return;
    await deleteReview(id);
    const res = await fetch("/api/admin/reviews");
    setReviews(await res.json());
    router.refresh();
  }

  function startEdit(item: TestimonialData) {
    setEditing(item);
    setName(item.client_name);
    setQuote(item.quote);
    setEventType(item.event_type || "Wedding");
    setFeatured(item.is_featured);
  }

  function resetForm() {
    setEditing(null);
    setName("");
    setQuote("");
    setEventType("Wedding");
    setFeatured(false);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Reviews & Testimonials</h1>
      <p className="text-sm text-gray-500 mt-1">Manage client reviews and testimonials.</p>

      {/* Tabs */}
      <div className="mt-6 flex gap-1 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("reviews")}
          className={`px-4 py-2.5 text-sm transition-colors ${activeTab === "reviews" ? "text-gold border-b-2 border-gold -mb-px" : "text-gray-500 hover:text-gray-700"}`}
        >
          Client Reviews ({reviews.length})
        </button>
        <button
          onClick={() => setActiveTab("testimonials")}
          className={`px-4 py-2.5 text-sm transition-colors ${activeTab === "testimonials" ? "text-gold border-b-2 border-gold -mb-px" : "text-gray-500 hover:text-gray-700"}`}
        >
          Manual Testimonials ({testimonials.length})
        </button>
      </div>

      {/* Reviews Tab */}
      {activeTab === "reviews" && (
        <div className="mt-6">
          <p className="text-xs text-gray-400 mb-4">These are submitted by clients through the review form on your website. They appear automatically.</p>
          {reviews.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No reviews yet.</p>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white border border-gray-200 p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <StarRating rating={review.rating} size="sm" showRating={false} />
                        <p className="text-sm font-medium text-gray-900">{review.client_name}</p>
                        {review.event_type && <span className="text-[10px] text-gray-400">{review.event_type}</span>}
                        <span className="text-[10px] text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2 italic">&ldquo;{review.review_text}&rdquo;</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteReview(review.id)} className="rounded-none text-xs text-red-500 border-red-200 shrink-0">
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Testimonials Tab */}
      {activeTab === "testimonials" && (
        <div className="mt-6">
          <p className="text-xs text-gray-400 mb-4">These are manually added by you. They show as a fallback when there are no client reviews.</p>

          {/* Form */}
          <div className="bg-white border border-gray-200 p-4 sm:p-6 max-w-2xl space-y-4 mb-6">
            <h3 className="text-sm font-medium text-gray-700">
              {editing ? "Edit Testimonial" : "Add Testimonial"}
            </h3>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Client name" className="rounded-none" />
            <Textarea value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="Their testimonial..." rows={4} className="rounded-none resize-none" />
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <select value={eventType} onChange={(e) => setEventType(e.target.value)} className="h-10 px-3 border border-gray-200 text-sm bg-white">
                <option>Wedding</option>
                <option>Engagement</option>
                <option>Pre-Wedding</option>
                <option>Event</option>
              </select>
              <div className="flex items-center gap-2">
                <Switch checked={featured} onCheckedChange={setFeatured} />
                <span className="text-xs text-gray-500">Featured on homepage</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveTestimonial} disabled={!name || !quote} className="bg-charcoal text-white rounded-none text-xs">
                {editing ? "Update" : "Add"}
              </Button>
              {editing && <Button variant="outline" onClick={resetForm} className="rounded-none text-xs">Cancel</Button>}
            </div>
          </div>

          <div className="space-y-3">
            {testimonials.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 p-4 sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 text-sm">{item.client_name}</p>
                      {item.is_featured && <span className="text-[10px] bg-gold/10 text-gold px-2 py-0.5">Featured</span>}
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2 italic">&ldquo;{item.quote}&rdquo;</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="outline" onClick={() => startEdit(item)} className="rounded-none text-xs">Edit</Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteTestimonial(item.id)} className="rounded-none text-xs text-red-500 border-red-200">Delete</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
