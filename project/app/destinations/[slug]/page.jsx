'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, Calendar, MapPin, CheckCircle, XCircle } from 'lucide-react';
import PackageCard from '@/components/PackageCard';
import ReviewCard from '@/components/ReviewCard';
import ReviewCarousel from '@/components/ReviewCarousel';
import SectionHeader from '@/components/SectionHeader';
import StarRating from '@/components/StarRating';
import ImageCarousel from '@/components/ImageCarousel';
import { useEnquiry } from '@/components/EnquiryContext';
import {
  getDestinationBySlug, getPackagesByDestination, getFaqs, getReviews, getGallery, REF_TYPE
} from '@/lib/queries';

function SkeletonCard({ height = 320 }) {
  return <div className="skeleton rounded-2xl" style={{ height }} />;
}

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-5 py-4 text-left bg-white hover:bg-slate-50 transition-colors">
        <span className="font-medium text-[#0f2744] text-sm pr-4">{question}</span>
        <ChevronDown size={18} className={`text-[#0d9488] flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 py-4 bg-slate-50 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function DestinationPage() {
  const { slug } = useParams();
  const { openModal } = useEnquiry();
  const [dest, setDest] = useState(null);
  const [packages, setPackages] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    async function load() {
      const d = await getDestinationBySlug(slug);
      if (!d) { setNotFound(true); setLoading(false); return; }
      setDest(d);
      const [pkgs, fqs, revs, gals] = await Promise.all([
        getPackagesByDestination(d.id),
        getFaqs(d.id, REF_TYPE.DESTINATION),
        getReviews(d.id, REF_TYPE.DESTINATION),
        getGallery(d.id, REF_TYPE.DESTINATION),
      ]);
      setPackages(pkgs);
      setFaqs(fqs);
      setReviews(revs);
      setGallery(gals);
      setLoading(false);
    }
    load();
  }, [slug]);

  if (notFound) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🗺️</div>
        <h2 className="text-2xl font-bold text-[#0f2744] mb-2">Destination Not Found</h2>
        <Link href="/" className="text-[#0d9488] hover:underline">Back to Home</Link>
      </div>
    </div>
  );

  return (
    <div>
      {/* Banner */}
      <div className="relative h-[60vh] min-h-[420px] overflow-hidden">
        {dest ? (
          <img src={dest.heroImage || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80'}
            alt={dest.name} className="w-full h-full object-cover" />
        ) : (
          <div className="skeleton w-full h-full" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f2744]/60 to-[#0f2744]/80" />
        <div className="absolute inset-0 flex flex-col justify-end pb-12 px-5 md:px-12">
          <nav className="flex items-center gap-2 text-white/60 text-xs mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span>Destinations</span>
            <span>/</span>
            <span className="text-white">{dest?.name || '...'}</span>
          </nav>
          <h1 className="text-4xl md:text-6xl font-bold text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}>{dest?.name}</h1>
          {dest?.state && (
            <p className="text-white/70 mt-2 text-lg">{dest.state} • Adventure • Nature</p>
          )}
        </div>
      </div>

      {/* Trust badges */}
      <div className="bg-[#0f2744] py-5 px-5">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-8 text-center">
          {[['🏷️', 'Best Price', 'Guarantee'], ['🛡️', 'Safe', 'Travel'], ['🧭', 'Expert', 'Guides'], ['🕐', '24/7', 'Support']].map(([icon, title, sub]) => (
            <div key={title} className="flex items-center gap-2 text-white">
              <span className="text-2xl">{icon}</span>
              <div className="text-left">
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-white/60">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About section */}
      <section className="py-16 px-5">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <ImageCarousel images={gallery} />
            <h2 className="text-2xl font-bold text-[#0f2744] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              About {dest?.name}
            </h2>
            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-4 rounded" />)}
              </div>
            ) : (
              <div className="text-slate-600 leading-relaxed prose max-w-none" dangerouslySetInnerHTML={{ __html: dest?.description || '' }} />
            )}
          </div>
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
            <h4 className="font-semibold text-[#0f2744] mb-4">Destination Highlights</h4>
            <div className="space-y-3 text-sm">
              {dest?.bestTime && (
                <div className="flex gap-3 items-start">
                  <Calendar size={16} className="text-[#0d9488] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-slate-700">Best Time to Visit</p>
                    <p className="text-slate-500 text-xs mt-0.5">{dest.bestTime}</p>
                  </div>
                </div>
              )}
              {dest?.state && (
                <div className="flex gap-3 items-start">
                  <MapPin size={16} className="text-[#0d9488] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-slate-700">State</p>
                    <p className="text-slate-500 text-xs mt-0.5">{dest.state}</p>
                  </div>
                </div>
              )}
            </div>
            <button onClick={() => openModal(dest?.name || '')}
              className="w-full mt-5 bg-[#d97706] hover:bg-[#b45309] text-white font-semibold py-3 rounded-xl text-sm transition-colors">
              Enquire About {dest?.name}
            </button>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-16 px-5 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title={`${dest?.name || ''} Tour Packages`}
            subtitle="Curated packages for an unforgettable experience"
          />
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : packages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packages.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400">No packages available for this destination yet.</div>
          )}
        </div>
      </section>

      {/* FAQs */}
      {faqs.length > 0 && (
        <section className="py-16 px-5">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-[#0f2744] mb-8"
              style={{ fontFamily: "'Playfair Display', serif" }}>Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map(faq => <FaqItem key={faq.id} question={faq.question} answer={faq.answer} />)}
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="py-16 px-5 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <SectionHeader title="Customer Reviews" subtitle={`What travelers say about ${dest?.name}`} />
            <ReviewCarousel reviews={reviews} />
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#0f2744] to-[#0d9488] py-16 px-5 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3"
          style={{ fontFamily: "'Playfair Display', serif" }}>
          Ready to Explore {dest?.name}?
        </h2>
        <p className="text-white/70 mb-6">Book your dream vacation today and get amazing discounts.</p>
        <button onClick={() => openModal(dest?.name || '')}
          className="bg-[#d97706] hover:bg-[#b45309] text-white font-semibold px-8 py-3.5 rounded-xl transition-all hover:shadow-lg">
          Enquire Now
        </button>
      </section>
    </div>
  );
}
