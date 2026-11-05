'use client';

import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, Wrench, MessageSquarePlus, CheckCircle2, ArrowRight } from 'lucide-react';

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  location: string;
  equipment: string;
  highlight: string;
  quote: string;
  verifiedOperator: boolean;
  rating?: number;
}

const INITIAL_TESTIMONIALS: TestimonialItem[] = [];

export function Testimonials() {
  const [reviews, setReviews] = useState<TestimonialItem[]>(INITIAL_TESTIMONIALS);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [equipment, setEquipment] = useState('');
  const [rating, setRating] = useState(5);
  const [highlight, setHighlight] = useState('');
  const [quote, setQuote] = useState('');
  const [formError, setFormError] = useState('');

  // Load any previously submitted local reviews on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('stump_user_reviews');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReviews([...parsed, ...INITIAL_TESTIMONIALS]);
        }
      }
    } catch {
      // LocalStorage suppressed or unavailable
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Please enter your name or company.');
      return;
    }
    if (!highlight.trim()) {
      setFormError('Please write a quick summary / highlight (e.g. Paid for itself on day 1).');
      return;
    }
    if (!quote.trim()) {
      setFormError('Please enter your review text.');
      return;
    }

    setIsSubmitting(true);

    const newReview: TestimonialItem = {
      id: `rev-${Date.now()}`,
      name: name.trim(),
      role: role.trim() || 'Verified Operator',
      location: location.trim() || 'United States',
      equipment: equipment.trim() || 'Commercial Grinder',
      highlight: highlight.trim(),
      quote: quote.trim(),
      verifiedOperator: true,
      rating,
    };

    try {
      // Send to server API
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      });

      // Update local state and persistence
      const updatedReviews = [newReview, ...reviews];
      setReviews(updatedReviews);

      try {
        const stored = localStorage.getItem('stump_user_reviews');
        const userList = stored ? JSON.parse(stored) : [];
        localStorage.setItem('stump_user_reviews', JSON.stringify([newReview, ...userList]));
      } catch {
        // Local storage suppressed
      }

      setSubmitSuccess(true);
      setShowForm(false);
      // Reset form fields
      setName('');
      setRole('');
      setLocation('');
      setEquipment('');
      setHighlight('');
      setQuote('');
      setRating(5);
    } catch {
      setFormError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (reviews.length === 0 && !showForm) {
    return null;
  }

  return (
    <section id="reviews" className="py-20 bg-[#FBF6EC] border-t border-bark/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
          <span className="text-xs font-bold tracking-widest uppercase text-forest font-sans">
            Real US Operators
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bark tracking-tight">
            Field-Tested on Real Jobs Across America
          </h2>
          <p className="text-bark/80 text-base leading-relaxed">
            See how solo operators and commercial tree care crews use these tools to protect their cutter teeth, avoid underbidding, and book profitable work.
          </p>

          {/* Action to leave a review */}
          <div className="pt-2">
            <button
              onClick={() => {
                setShowForm(!showForm);
                setSubmitSuccess(false);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sand border border-wood/40 text-bark hover:bg-wood/20 hover:border-orange font-sans text-xs font-bold transition-all shadow-sm"
            >
              <MessageSquarePlus size={16} className="text-orange" />
              <span>{showForm ? 'Close Review Form' : 'Bought the Playbook? Leave Your Field Review'}</span>
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {submitSuccess && (
          <div className="max-w-xl mx-auto mb-10 p-4 rounded-xl bg-forest/15 border border-forest/30 flex items-center gap-3 text-forest-dark animate-in fade-in">
            <CheckCircle2 size={20} className="text-forest shrink-0" />
            <div className="text-xs">
              <span className="font-bold">Thank you for your review!</span> Your field feedback has been added below to help other operators.
            </div>
          </div>
        )}

        {/* REVIEW SUBMISSION FORM SECTION */}
        {showForm && (
          <div className="max-w-2xl mx-auto mb-14 bg-white border-2 border-orange/40 rounded-2xl p-6 sm:p-8 shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="border-b border-bark/10 pb-4 mb-6">
              <h3 className="font-serif font-bold text-xl text-bark flex items-center gap-2">
                <MessageSquarePlus className="text-orange" size={20} />
                <span>Submit Your Operator Review</span>
              </h3>
              <p className="text-xs text-bark/70 mt-1">
                Share your real numbers, machine setup, or how the formulas worked on your job site.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  {formError}
                </div>
              )}

              {/* Star Rating Selector */}
              <div>
                <label className="block text-xs font-bold text-bark uppercase tracking-wider mb-1.5">
                  Your Overall Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-orange hover:scale-110 transition-transform"
                      title={`${star} Star${star > 1 ? 's' : ''}`}
                    >
                      <Star
                        size={24}
                        fill={star <= rating ? '#E8731A' : 'none'}
                        stroke="#E8731A"
                        strokeWidth={1.5}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono font-bold text-bark/70 ml-2">
                    {rating} of 5 Stars
                  </span>
                </div>
              </div>

              {/* Name and Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-bark uppercase tracking-wider mb-1">
                    Your Name / Company <span className="text-orange">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jake Larson"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bark/20 bg-sand/20 text-bark text-xs font-sans focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-bark uppercase tracking-wider mb-1">
                    Role / Business Title
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Owner, Larson Stump Care"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bark/20 bg-sand/20 text-bark text-xs font-sans focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange"
                  />
                </div>
              </div>

              {/* Location and Equipment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-bark uppercase tracking-wider mb-1">
                    City, State
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Knoxville, TN"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bark/20 bg-sand/20 text-bark text-xs font-sans focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-bark uppercase tracking-wider mb-1">
                    Your Grinder / Equipment
                  </label>
                  <input
                    type="text"
                    value={equipment}
                    onChange={(e) => setEquipment(e.target.value)}
                    placeholder="e.g. Vermeer SC362 / Toro STX-26"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bark/20 bg-sand/20 text-bark text-xs font-sans focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange"
                  />
                </div>
              </div>

              {/* Review Highlight / Headline */}
              <div>
                <label className="block text-xs font-bold text-bark uppercase tracking-wider mb-1">
                  Headline / Quick Result <span className="text-orange">*</span>
                </label>
                <input
                  type="text"
                  value={highlight}
                  onChange={(e) => setHighlight(e.target.value)}
                  placeholder="e.g. Paid for itself on my very first job this Saturday"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-bark/20 bg-sand/20 text-bark text-xs font-sans focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange"
                  required
                />
              </div>

              {/* Review Details */}
              <div>
                <label className="block text-xs font-bold text-bark uppercase tracking-wider mb-1">
                  Your Review / Field Experience <span className="text-orange">*</span>
                </label>
                <textarea
                  rows={4}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="Tell other operators what worked: the pricing calculator, waiver template, utility locate protocols, or tooth fund formula..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-bark/20 bg-sand/20 text-bark text-xs font-sans focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange leading-relaxed"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-xs font-semibold text-bark/60 hover:text-bark"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-orange hover:bg-orange-hover text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Posting Review...' : 'Submit Operator Review'}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((item) => (
            <div
              key={item.id}
              className="bg-sand/30 border border-bark/15 hover:border-wood rounded-2xl p-7 flex flex-col justify-between shadow-sm transition-all duration-200 hover:-translate-y-1"
            >
              <div className="space-y-4">
                {/* Rating stars & verified badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-orange">
                    {[1, 2, 3, 4, 5].map((starIdx) => (
                      <Star
                        key={starIdx}
                        size={16}
                        fill={starIdx <= Math.max(1, Math.min(5, Math.round(Number(item.rating) || 5))) ? '#E8731A' : 'none'}
                        stroke={starIdx <= Math.max(1, Math.min(5, Math.round(Number(item.rating) || 5))) ? 'none' : '#E8731A'}
                      />
                    ))}
                  </div>
                  {item.verifiedOperator && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-forest bg-forest/10 px-2 py-0.5 rounded-full">
                      <ShieldCheck size={13} />
                      <span>Verified Operator</span>
                    </span>
                  )}
                </div>

                {/* Highlight callout */}
                <p className="font-serif font-bold text-bark text-base leading-snug">
                  &ldquo;{item.highlight}&rdquo;
                </p>

                {/* Quote body */}
                <p className="text-xs sm:text-sm text-bark/80 leading-relaxed font-sans">
                  {item.quote}
                </p>
              </div>

              {/* Author footer & equipment info */}
              <div className="pt-6 mt-6 border-t border-bark/10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-bark text-sm">{item.name}</h4>
                    <p className="text-[11px] text-wood-dark">{item.role}</p>
                  </div>
                  <span className="text-[11px] font-semibold text-bark/60">{item.location}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-mono text-orange/90 bg-sand/60 px-2.5 py-1 rounded-md border border-bark/5">
                  <Wrench size={12} className="shrink-0" />
                  <span>Equipment: {item.equipment}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
