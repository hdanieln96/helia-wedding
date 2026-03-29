"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import StarRating from "@/components/star-rating";
import { submitReview } from "@/lib/actions/reviews";

interface Review {
  id: number;
  client_name: string;
  rating: number;
  review_text: string;
  event_type: string | null;
  created_at: string;
}

interface ReviewsClientProps {
  reviews: Review[];
  showStars: boolean;
  avgRating: number;
  totalReviews: number;
}

export default function ReviewsClient({ reviews, showStars, avgRating, totalReviews }: ReviewsClientProps) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(5);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.set("rating", String(rating));
    const result = await submitReview(formData);

    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error || "Something went wrong.");
    }
    setLoading(false);
  }

  return (
    <>
      {/* Summary Bar */}
      {totalReviews > 0 && showStars && (
        <section className="py-8 px-6 border-b border-border">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <div className="flex items-center gap-3">
              <span className="font-[family-name:var(--font-heading)] text-4xl text-charcoal">{avgRating}</span>
              <div>
                <StarRating rating={Math.round(avgRating)} size="md" showRating={false} />
                <p className="text-xs text-muted-foreground mt-0.5">Based on {totalReviews} review{totalReviews !== 1 ? "s" : ""}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Review Form */}
      <section className="py-16 md:py-24 px-6 bg-warm-white">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
          >
            <span className="text-gold text-xs tracking-[0.4em] uppercase">Share Your Experience</span>
            <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-light text-charcoal">
              Leave a Review
            </h2>
            <div className="mt-4 h-px w-16 bg-gold mx-auto" />
          </motion.div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 rounded-full border-2 border-gold flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-heading)] text-2xl text-charcoal">Thank You!</h3>
              <p className="mt-3 text-muted-foreground">Your review has been posted. We appreciate your kind words!</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 sm:p-8 border border-border">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="clientName" className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                    Your Name *
                  </Label>
                  <Input
                    id="clientName"
                    name="clientName"
                    required
                    placeholder="Your name"
                    className="mt-2 rounded-none border-border focus:border-gold"
                  />
                </div>
                <div>
                  <Label htmlFor="eventType" className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                    Event Type
                  </Label>
                  <select
                    id="eventType"
                    name="eventType"
                    className="mt-2 w-full h-10 px-3 border border-border bg-transparent text-sm focus:border-gold focus:outline-none"
                  >
                    <option value="">Select type</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Engagement">Engagement</option>
                    <option value="Pre-Wedding">Pre-Wedding</option>
                    <option value="Event">Event</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {showStars && (
                <div>
                  <Label className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                    Rating *
                  </Label>
                  <div className="mt-2">
                    <StarRating rating={rating} size="lg" interactive onChange={setRating} showRating={false} />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="reviewText" className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                  Your Review *
                </Label>
                <Textarea
                  id="reviewText"
                  name="reviewText"
                  required
                  rows={4}
                  placeholder="Tell us about your experience..."
                  className="mt-2 rounded-none border-border focus:border-gold resize-none"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gold hover:bg-gold-dark text-white tracking-[0.2em] uppercase text-xs py-6 rounded-none disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* All Reviews */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-4xl mx-auto">
          {reviews.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No reviews yet. Be the first to share your experience!</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: Math.min(i * 0.1, 0.3) }}
                  className="border border-border p-6 sm:p-8"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      {showStars && <StarRating rating={review.rating} size="sm" showRating={false} />}
                      <h3 className="font-[family-name:var(--font-heading)] text-lg text-charcoal mt-2">
                        {review.client_name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {review.event_type && (
                          <span className="text-xs text-gold tracking-[0.2em] uppercase">{review.event_type}</span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-muted-foreground leading-relaxed italic">
                    &ldquo;{review.review_text}&rdquo;
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
