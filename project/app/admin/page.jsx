'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Mountain, Package, Star, ArrowRight, Clock, CheckCircle } from 'lucide-react';
import {
  getDestinationsApi, getTreksApi, getPackagesApi,
  getPendingReviews, getAllReviewsApi
} from '@/lib/api';
import { LoadingSpinner } from '@/components/admin/Common';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ destinations: 0, treks: 0, packages: 0, pendingReviews: 0, totalReviews: 0 });
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [dests, treks, packs, pendingRevs, allRevs] = await Promise.all([
          getDestinationsApi().catch(() => []),
          getTreksApi().catch(() => []),
          getPackagesApi().catch(() => []),
          getPendingReviews().catch(() => []),
          getAllReviewsApi().catch(() => []),
        ]);
        setStats({
          destinations: dests?.length || 0,
          treks: treks?.length || 0,
          packages: packs?.length || 0,
          pendingReviews: pendingRevs?.length || 0,
          totalReviews: allRevs?.length || 0,
        });
        setPending(pendingRevs || []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner />;

  const cards = [
    { label: 'Destinations', value: stats.destinations, icon: MapPin, href: '/admin/destinations', color: 'bg-blue-50 text-blue-600' },
    { label: 'Treks', value: stats.treks, icon: Mountain, href: '/admin/treks', color: 'bg-teal-50 text-teal-600' },
    { label: 'Packages', value: stats.packages, icon: Package, href: '/admin/packages', color: 'bg-amber-50 text-amber-600' },
    { label: 'Pending Reviews', value: stats.pendingReviews, icon: Clock, href: '/admin/reviews', color: 'bg-red-50 text-red-600' },
    { label: 'Total Reviews', value: stats.totalReviews, icon: Star, href: '/admin/reviews', color: 'bg-green-50 text-green-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0f2744]" style={{ fontFamily: "'Playfair Display', serif" }}>Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Overview of your travel content management system</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, href, color }) => (
          <Link key={label} href={href}
            className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-lg transition-shadow card-hover">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 ${color}`}>
              <Icon size={20} />
            </div>
            <p className="text-3xl font-bold text-[#0f2744]">{value}</p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-[#0f2744] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: 'Add Destination', href: '/admin/destinations' },
              { label: 'Create Trek', href: '/admin/treks' },
              { label: 'Create Package', href: '/admin/packages' },
              { label: 'Add Itinerary', href: '/admin/itinerary' },
              { label: 'Add FAQ', href: '/admin/faqs' },
              { label: 'Upload Images', href: '/admin/images' },
            ].map(({ label, href }) => (
              <Link key={href} href={href}
                className="flex items-center justify-between px-4 py-3 rounded-xl border border-slate-100 hover:border-[#0d9488] hover:bg-teal-50/30 transition-colors group">
                <span className="text-sm font-medium text-slate-700">{label}</span>
                <ArrowRight size={16} className="text-slate-300 group-hover:text-[#0d9488] transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* Pending reviews */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#0f2744]" style={{ fontFamily: "'Playfair Display', serif" }}>Pending Reviews</h2>
            <Link href="/admin/reviews" className="text-xs text-[#0d9488] hover:underline font-medium">View all</Link>
          </div>
          {pending.length > 0 ? (
            <div className="space-y-3">
              {pending.slice(0, 5).map(r => (
                <div key={r.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#0f2744] truncate">{r.userName}</p>
                    <p className="text-xs text-slate-500 truncate">{r.comment}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} size={11} className={i <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle size={32} className="text-green-400 mb-2" />
              <p className="text-sm text-slate-400">No pending reviews</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
