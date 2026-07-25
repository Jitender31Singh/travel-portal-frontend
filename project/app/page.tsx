// @ts-nocheck
import Link from 'next/link';
import { ChevronDown, Shield, Compass, Leaf, Heart, Star } from 'lucide-react';
import DestinationCard from '@/components/DestinationCard';
import PackageCard from '@/components/PackageCard';
import TrekCard from '@/components/TrekCard';
import ReviewCard from '@/components/ReviewCard';
import ReviewCarousel from '@/components/ReviewCarousel';
import SectionHeader from '@/components/SectionHeader';
import { HeroButtons, CtaButton } from '@/components/HomeClientButtons';
import HomeFaqSection from '@/components/HomeFaqSection';
import { getDestinations, getPackages, getTreks, getAllReviews } from '@/lib/queries';

export const dynamic = 'force-dynamic';

function StatItem({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{number}</div>
      <div className="text-slate-400 text-sm mt-1">{label}</div>
    </div>
  );
}

export default async function HomePage() {
  const [destinations, packages, treks, reviews] = await Promise.all([
    getDestinations(),
    getPackages(),
    getTreks(),
    getAllReviews()
  ]);

  return (
    <div>
      {/* ── Hero ────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=80"
            alt="Mountains"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f2744]/70 via-[#0f2744]/40 to-[#0f2744]/80" />
        </div>
        <div className="relative z-10 text-center text-white px-5 max-w-3xl mx-auto pt-20">
          <span className="inline-block bg-[#d97706]/20 border border-[#d97706]/40 text-[#f59e0b] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            Explore India
          </span>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Choose Your<br />
            <em className="text-[#f59e0b] not-italic">Next Destination</em>
          </h1>
          <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Explore the most beautiful places in India with GoonnexTrip. Expert guides, best prices, unforgettable memories.
          </p>
          <HeroButtons />
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown size={28} className="text-white/60" />
        </div>
      </section>

      {/* ── Stats strip ─────────────────────────────────── */}
      <div className="bg-[#0f2744] py-10 px-5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatItem number="50+" label="Amazing Treks" />
          <StatItem number="10K+" label="Happy Travelers" />
          <StatItem number="4.8★" label="Average Rating" />
          <StatItem number="100%" label="Safe & Secure" />
        </div>
      </div>

      {/* ── Destinations ────────────────────────────────── */}
      <section className="py-20 px-5">
        <div className="max-w-7xl mx-auto">
          <SectionHeader title="Popular Destinations" subtitle="Discover handpicked destinations across India" />
          {destinations?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {destinations.map(d => <DestinationCard key={d.id} destination={d} />)}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400">No destinations available yet.</div>
          )}
        </div>
      </section>

      {/* ── Packages ────────────────────────────────────── */}
      <section className="py-20 px-5 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <SectionHeader title="Tour Packages" subtitle="Curated packages for every type of traveler" viewAllHref="/packages" />
          {packages?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packages.slice(0, 3).map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400">No packages available yet.</div>
          )}
        </div>
      </section>

      {/* ── Treks ───────────────────────────────────────── */}
      <section className="py-20 px-5">
        <div className="max-w-7xl mx-auto">
          <SectionHeader title="Treks By GoonnexTrip" subtitle="Adventure, nature, and unforgettable trails" viewAllHref="/treks" />
          {treks?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {treks.slice(0, 3).map(t => <TrekCard key={t.id} trek={t} />)}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400">No treks available yet.</div>
          )}
        </div>
      </section>

      {/* ── Why GoonnexTrip ──────────────────────────────── */}
      <section className="py-20 px-5 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#d97706]">Why GoonnexTrip</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0f2744] mt-3 mb-5"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                Travel With Purpose,<br />Explore With Heart
              </h2>
              <p className="text-slate-500 leading-relaxed mb-10">
                We create unforgettable journeys with expert planning, authentic local experiences, and safe adventures that leave you with memories for a lifetime.
              </p>
              <div className="grid grid-cols-2 gap-5">
                {[
                  [Compass, 'Expert Guides', 'Experienced local experts on every route'],
                  [Shield, 'Safe Travel', 'Secure and trusted trips since day one'],
                  [Leaf, 'Sustainable', 'Responsible travel for a greener planet'],
                  [Heart, 'Memories', 'Experiences that stay with you forever'],
                ].map(([Icon, title, desc]) => (
                  <div key={`${title}`} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                    <div className="w-10 h-10 bg-[#0d9488]/10 rounded-lg flex items-center justify-center mb-3">
                      <Icon size={18} className="text-[#0d9488]" />
                    </div>
                    <h4 className="font-semibold text-[#0f2744] text-sm mb-1">{`${title}`}</h4>
                    <p className="text-xs text-slate-500">{`${desc}`}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80"
                alt="Travel Adventure"
                className="rounded-2xl shadow-2xl w-full object-cover h-[480px]"
              />
              <div className="absolute -bottom-6 -left-6 bg-[#0f2744] text-white rounded-2xl p-5 shadow-xl hidden lg:block">
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-bold text-[#f59e0b]">4.9</div>
                  <div>
                    <div className="flex gap-0.5 mb-0.5">
                      {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="#f59e0b" className="text-[#f59e0b]" />)}
                    </div>
                    <p className="text-xs text-slate-300">from 2,400+ reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews ─────────────────────────────────────── */}
      <section className="py-20 px-5">
        <div className="max-w-7xl mx-auto">
          <SectionHeader title="What Travelers Say" subtitle="Experiences shared by our happy adventurers" />
          {reviews?.length > 0 ? (
            <ReviewCarousel reviews={reviews} />
          ) : (
            <div className="text-center py-16 text-slate-400">No reviews yet. Be the first!</div>
          )}
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────── */}
      <section className="bg-gradient-to-r from-[#0f2744] to-[#1a3a5c] py-20 px-5 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4"
          style={{ fontFamily: "'Playfair Display', serif" }}>
          Ready to Explore India?
        </h2>
        <p className="text-white/70 mb-8 max-w-xl mx-auto">
          Book your dream vacation today. Expert-guided tours, best prices, unforgettable memories.
        </p>
        <CtaButton />
      </section>

      {/* ── FAQ Section ─────────────────────────────────── */}
      <HomeFaqSection destinations={destinations} />
    </div>
  );
}
