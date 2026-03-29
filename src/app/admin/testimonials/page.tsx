"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { addTestimonial, updateTestimonial, deleteTestimonial } from "@/lib/actions/testimonials";

interface TestimonialData {
  id: number;
  client_name: string;
  quote: string;
  event_type: string;
  is_featured: boolean;
}

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<TestimonialData[]>([]);
  const [editing, setEditing] = useState<TestimonialData | null>(null);
  const [name, setName] = useState("");
  const [quote, setQuote] = useState("");
  const [eventType, setEventType] = useState("Wedding");
  const [featured, setFeatured] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/testimonials").then((r) => r.json()).then(setItems);
  }, []);

  async function handleSave() {
    if (editing) {
      await updateTestimonial(editing.id, name, quote, eventType, featured);
    } else {
      await addTestimonial(name, quote, eventType, featured);
    }
    resetForm();
    const res = await fetch("/api/admin/testimonials");
    setItems(await res.json());
    router.refresh();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this testimonial?")) return;
    await deleteTestimonial(id);
    const res = await fetch("/api/admin/testimonials");
    setItems(await res.json());
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
      <h1 className="text-2xl font-semibold text-gray-900">Testimonials</h1>
      <p className="text-sm text-gray-500 mt-1">Manage client testimonials and reviews.</p>

      {/* Form */}
      <div className="mt-6 bg-white border border-gray-200 p-4 sm:p-6 max-w-2xl space-y-4">
        <h3 className="text-sm font-medium text-gray-700">
          {editing ? "Edit Testimonial" : "Add New Testimonial"}
        </h3>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Client name (e.g. Sarah & James)" className="rounded-none" />
        <Textarea value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="Their testimonial quote..." rows={4} className="rounded-none resize-none" />
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
          <Button onClick={handleSave} disabled={!name || !quote} className="bg-charcoal text-white rounded-none text-xs">
            {editing ? "Update" : "Add"} Testimonial
          </Button>
          {editing && (
            <Button variant="outline" onClick={resetForm} className="rounded-none text-xs">Cancel</Button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900 text-sm">{item.client_name}</p>
                  {item.is_featured && <span className="text-[10px] bg-gold/10 text-gold px-2 py-0.5">Featured</span>}
                  <span className="text-[10px] text-gray-400">{item.event_type}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2 italic">&ldquo;{item.quote}&rdquo;</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="outline" onClick={() => startEdit(item)} className="rounded-none text-xs">Edit</Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(item.id)} className="rounded-none text-xs text-red-500 border-red-200">Delete</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
