'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, CheckCircle, XCircle, MapPin, Users, Clock, Mountain, Star } from 'lucide-react';
import ReviewCard from '@/components/ReviewCard';
import ReviewCarousel from '@/components/ReviewCarousel';
import StarRating from '@/components/StarRating';
import ImageCarousel from '@/components/ImageCarousel';
import Expandable from '@/components/Expandable';
import { useEnquiry } from '@/components/EnquiryContext';
import {
  getPackageBySlug, getItinerary, getFaqs, getReviews, submitReview, getGallery, REF_TYPE
} from '@/lib/queries';

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-5 py-4 text-left bg-white hover:bg-slate-50 transition-colors">
        <span className="font-medium text-[#0f2744] text-sm pr-4">{question}</span>
        <ChevronDown size={18} className={`text-[#0d9488] flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-5 py-4 bg-slate-50 text-sm text-slate-600 leading-relaxed border-t border-slate-100">{answer}</div>}
    </div>
  );
}

function ItineraryItem({ day, isLast, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="flex gap-4 group cursor-pointer" onClick={() => setOpen(!open)}>
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-md transition-colors duration-300 ${open ? 'bg-[#0d9488] text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-[#0d9488]/20 group-hover:text-[#0d9488]'}`}>
          D{day.dayNumber}
        </div>
        {!isLast && <div className={`w-0.5 flex-1 mt-2 transition-colors duration-300 ${open ? 'bg-[#0d9488]/30' : 'bg-slate-200 group-hover:bg-[#0d9488]/20'}`} />}
      </div>
      <div className={`pb-6 flex-1 bg-white p-5 rounded-2xl border transition-all duration-300 ${open ? 'border-[#0d9488]/30 shadow-md shadow-[#0d9488]/5' : 'border-slate-100 shadow-sm group-hover:border-[#0d9488]/20'}`}>
        <div className="flex justify-between items-center mb-1">
          <h4 className={`font-semibold text-base transition-colors duration-300 ${open ? 'text-[#0d9488]' : 'text-[#0f2744]'}`}>{day.title}</h4>
          <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${open ? 'rotate-180 text-[#0d9488]' : ''}`} />
        </div>
        
        {open && (
          <div className="mt-4 animate-fade-up" onClick={(e) => e.stopPropagation()}>
            {day.description && <div className="text-sm text-slate-600 leading-relaxed mb-3 prose max-w-none" dangerouslySetInnerHTML={{ __html: day.description }} />}
            <div className="flex flex-wrap gap-2 text-xs font-medium mt-2">
              {day.meals && <span className="bg-amber-50 text-amber-800 px-2.5 py-1 rounded-full flex items-center gap-1">🍴 {day.meals}</span>}
              {(day.travelMode || day.travel_mode) && <span className="bg-blue-50 text-blue-800 px-2.5 py-1 rounded-full flex items-center gap-1">🚗 {day.travelMode || day.travel_mode}</span>}
              {day.stay && <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full flex items-center gap-1">🏨 {day.stay}</span>}
              {(day.distanceCovered || day.distance_covered) && <span className="bg-teal-50 text-teal-800 px-2.5 py-1 rounded-full flex items-center gap-1">🗺️ {day.distanceCovered || day.distance_covered}</span>}
              {(day.altitude || day.max_altitude) && <span className="bg-purple-50 text-purple-800 px-2.5 py-1 rounded-full flex items-center gap-1">⛰️ {day.altitude || day.max_altitude}</span>}
            </div>
            {day.activities?.length > 0 && (
              <ul className="mt-4 space-y-2 pt-3 border-t border-slate-50">
                {day.activities.map((a, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-center gap-2 font-medium">
                    <span className="w-1.5 h-1.5 bg-[#0d9488] rounded-full flex-shrink-0" /> {a}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PackageDetailPage() {
  const { slug } = useParams();
  const { openModal } = useEnquiry();
  const [pkg, setPkg] = useState(null);
  const [itinerary, setItinerary] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: '', email: '', rating: '', comment: '' });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (!slug) return;
    async function load() {
      const p = await getPackageBySlug(slug);
      console.log('Package data:', JSON.stringify(p, null, 2));
      if (!p) { setNotFound(true); setLoading(false); return; }
      setPkg(p);
      console.log('Ref_TYpe of package :', REF_TYPE.PACKAGE);
      const [itin, fqs, revs, gals] = await Promise.all([
        getItinerary(p.id, REF_TYPE.PACKAGE),
        getFaqs(p.id, REF_TYPE.PACKAGE),
        getReviews(p.id, REF_TYPE.PACKAGE),
        getGallery(p.id, REF_TYPE.PACKAGE),
      ]);
      setItinerary(itin);
      setFaqs(fqs);
      setReviews(revs);
      setGallery(gals);
      setLoading(false);
    }
    load();
  }, [slug]);

  async function handleReviewSubmit(e) {
    e.preventDefault();
    if (!pkg) return;
    setReviewLoading(true);
    const result = await submitReview({
      referenceId: pkg.id,
      referenceType: REF_TYPE.PACKAGE,
      userName: reviewForm.name,
      email: reviewForm.email,
      rating: parseInt(reviewForm.rating),
      comment: reviewForm.comment,
    });
    setReviewLoading(false);
    if (result) {
      setReviewSuccess(true);
      setReviewForm({ name: '', email: '', rating: '', comment: '' });
    }
  }

  if (notFound) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">📦</div>
        <h2 className="text-2xl font-bold text-[#0f2744] mb-2">Package Not Found</h2>
        <Link href="/packages" className="text-[#0d9488] hover:underline">Browse all packages</Link>
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#0d9488] border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm">Loading package details…</p>
      </div>
    </div>
  );

  return (
    <div>
      {/* Banner */}
      <div className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <img src={pkg.cover_image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80'}
          alt={pkg.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f2744]/60 to-[#0f2744]/85" />
        <div className="absolute inset-0 flex flex-col justify-end pb-12 px-5 md:px-12">
          <nav className="flex items-center gap-2 text-white/60 text-xs mb-4">
            <Link href="/" className="hover:text-white">Home</Link><span>/</span>
            <Link href="/packages" className="hover:text-white">Packages</Link><span>/</span>
            <span className="text-white">{pkg.title}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}>{pkg.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-white/80">
            <span className="flex items-center gap-1"><Clock size={14} /> {pkg.durationNights}N / {pkg.durationDays}D</span>
            {pkg.pickupPoint && <span className="flex items-center gap-1"><MapPin size={14} /> {pkg.pickupPoint}</span>}
            {pkg.maxGroupSize && <span className="flex items-center gap-1"><Users size={14} /> Max {pkg.maxGroupSize} people</span>}
            {pkg.difficulty && <span className="flex items-center gap-1"><Mountain size={14} /> {pkg.difficulty}</span>}
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-5 py-12 grid lg:grid-cols-3 gap-10">
        {/* Left: content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Gallery Carousel */}
          <ImageCarousel images={gallery} />

          {/* Overview */}
          <div>
            <h2 className="text-2xl font-bold text-[#0f2744] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Overview</h2>
            <Expandable maxHeight={250}>
              <div className="text-slate-600 leading-relaxed prose max-w-none" dangerouslySetInnerHTML={{ __html: pkg.overview }} />
            </Expandable>
            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              {[
                ['Pickup', pkg.pickupPoint],
                ['Drop', pkg.dropPoint],
                ['Accommodation', pkg.accommodationType],
                ['Best Time', pkg.bestTimeToVisit],
                ['Transport', pkg.transportIncluded],
              ].filter(([, v]) => v).map(([label, value]) => (
                <div key={label} className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
                  <div className="text-sm font-medium text-[#0f2744]" dangerouslySetInnerHTML={{ __html: value }} />
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions & Exclusions */}
          {(pkg.inclusions?.length > 0 || pkg.exclusions?.length > 0) && (
            <div>
              <h2 className="text-2xl font-bold text-[#0f2744] mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>Inclusions & Exclusions</h2>
              <Expandable maxHeight={350}>
                <div className="grid sm:grid-cols-2 gap-5">
                  {pkg.inclusions?.length > 0 && (
                    <div className="bg-green-50 rounded-2xl p-5">
                      <h4 className="font-semibold text-green-800 mb-3 text-sm uppercase tracking-wide">Included</h4>
                      <ul className="space-y-3">
                        {pkg.inclusions.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-green-800">
                            <CheckCircle size={16} className="flex-shrink-0 mt-0.5 text-green-700" />
                            <div className="prose prose-sm prose-p:my-0 prose-ul:my-0 prose-li:my-0 max-w-none flex-1" dangerouslySetInnerHTML={{ __html: item }} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {pkg.exclusions?.length > 0 && (
                    <div className="bg-red-50 rounded-2xl p-5">
                      <h4 className="font-semibold text-red-800 mb-3 text-sm uppercase tracking-wide">Excluded</h4>
                      <ul className="space-y-3">
                        {pkg.exclusions.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-red-800">
                            <XCircle size={16} className="flex-shrink-0 mt-0.5 text-red-700" />
                            <div className="prose prose-sm prose-p:my-0 prose-ul:my-0 prose-li:my-0 max-w-none flex-1" dangerouslySetInnerHTML={{ __html: item }} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Expandable>
            </div>
          )}

          {/* Cancellation Policy */}
          {pkg.cancellationPolicy && (
            <div>
              <h2 className="text-2xl font-bold text-[#0f2744] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Cancellation Policy</h2>
              <Expandable maxHeight={200}>
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-sm text-slate-700 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: pkg.cancellationPolicy }} />
              </Expandable>
            </div>
          )}

          {/* Terms & Conditions */}
          {pkg.termsAndConditions && (
            <div>
              <h2 className="text-2xl font-bold text-[#0f2744] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Terms & Conditions</h2>
              <Expandable maxHeight={200}>
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-sm text-slate-700 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: pkg.termsAndConditions }} />
              </Expandable>
            </div>
          )}

          {/* Itinerary */}
          {itinerary.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-[#0f2744] mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>Day-by-Day Itinerary</h2>
              <div className="space-y-4">
                {itinerary
                  .slice()
                  .sort((a, b) => (a.dayNumber || 0) - (b.dayNumber || 0))
                  .map((day, idx, arr) => (
                    <ItineraryItem 
                      key={day.id || day.dayNumber} 
                      day={day} 
                      isLast={idx === arr.length - 1} 
                      defaultOpen={idx === 0} 
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Things to Carry */}
          {pkg.thingsToCarry?.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-[#0f2744] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Things to Carry</h2>
              <div className="bg-amber-50 rounded-2xl p-5">
                <ul className="grid sm:grid-cols-2 gap-2">
                  {pkg.thingsToCarry.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-amber-800">
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full flex-shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* FAQs */}
          {faqs.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-[#0f2744] mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>FAQs</h2>
              <div className="space-y-3">
                {faqs.map(faq => <FaqItem key={faq.id} question={faq.question} answer={faq.answer} />)}
              </div>
            </div>
          )}

          {/* Reviews */}
          {reviews.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-[#0f2744] mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>Customer Reviews</h2>
              <ReviewCarousel reviews={reviews} />
            </div>
          )}
        </div>

        {/* Right: sticky card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-5">
            {/* Price & Book */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
              <p className="text-xs text-slate-400 mb-1">Package Price</p>
              <div className="text-4xl font-bold text-[#0d9488] mb-0.5">
                ₹{Number(pkg.price).toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-slate-400 mb-5">/person</p>
              {/* <button onClick={() => openModal(pkg.title)}
                className="w-full bg-[#d97706] hover:bg-[#b45309] text-white font-semibold py-3 rounded-xl transition-colors mb-3">
                Book Now
              </button> */}
              <button onClick={() => openModal(pkg.title)}
                className="w-full border border-[#0f2744] text-[#0f2744] hover:bg-[#0f2744] hover:text-white font-semibold py-3 rounded-xl transition-colors">
                Enquire Now
              </button>
              <p className="text-center text-xs text-slate-400 mt-4">🛡 Best Price Guarantee &nbsp;|&nbsp; 24/7 Support</p>
            </div>

            {/* Write a review */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h4 className="font-semibold text-[#0f2744] mb-4">Write a Review</h4>
              {reviewSuccess ? (
                <div className="text-center py-4">
                  <div className="text-3xl mb-2">⭐</div>
                  <p className="text-sm text-green-600 font-medium">Review submitted! Thank you.</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <input value={reviewForm.name} onChange={e => setReviewForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Your Name" required
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]" />
                  <input type="email" value={reviewForm.email} onChange={e => setReviewForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="Email" required
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]" />
                  <select value={reviewForm.rating} onChange={e => setReviewForm(f => ({ ...f, rating: e.target.value }))} required
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]">
                    <option value="">Select Rating</option>
                    <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                    <option value="4">⭐⭐⭐⭐ Good</option>
                    <option value="3">⭐⭐⭐ Average</option>
                    <option value="2">⭐⭐ Poor</option>
                    <option value="1">⭐ Terrible</option>
                  </select>
                  <textarea value={reviewForm.comment} onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                    placeholder="Share your experience…" rows={3}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488] resize-none" />
                  <button type="submit" disabled={reviewLoading}
                    className="w-full bg-[#0d9488] hover:bg-[#0a7a70] disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">
                    {reviewLoading ? 'Submitting…' : 'Submit Review'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
