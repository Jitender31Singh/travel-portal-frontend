'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import PackageCard from '@/components/PackageCard';
import SectionHeader from '@/components/SectionHeader';
import { getPackages, getDestinations } from '@/lib/queries';

function SkeletonCard() {
  return <div className="skeleton rounded-2xl h-[340px]" />;
}

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [selectedDest, setSelectedDest] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getPackages(), getDestinations()]).then(([pkgs, dests]) => {
      setPackages(pkgs);
      setDestinations(dests);
      setLoading(false);
    });
  }, []);

  const filtered = packages.filter(pkg => {
    const matchDest = !selectedDest || pkg.destination_id === selectedDest;
    const matchSearch = !search || pkg.title.toLowerCase().includes(search.toLowerCase());
    return matchDest && matchSearch;
  });

  return (
    <div>
      {/* Banner */}
      <div className="relative h-72 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80"
          alt="Packages" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f2744]/70 to-[#0f2744]/90" />
        <div className="absolute inset-0 flex flex-col justify-center px-5 md:px-12 pt-16">
          <nav className="flex items-center gap-2 text-white/60 text-xs mb-3">
            <Link href="/" className="hover:text-white">Home</Link><span>/</span><span className="text-white">Packages</span>
          </nav>
          <h1 className="text-4xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Tour Packages</h1>
          <p className="text-white/70 mt-2">Curated packages for every type of traveler across India</p>
        </div>
      </div>

      <section className="py-16 px-5">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-8 flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Search</label>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search package name…"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent" />
            </div>
            <div className="min-w-[180px]">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Destination</label>
              <select value={selectedDest} onChange={e => setSelectedDest(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent">
                <option value="">All Destinations</option>
                {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <button onClick={() => { setSearch(''); setSelectedDest(''); }}
              className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:border-[#0d9488] hover:text-[#0d9488] transition-colors">
              Clear
            </button>
          </div>

          <p className="text-sm text-slate-500 mb-6">
            Showing <strong>{filtered.length}</strong> package{filtered.length !== 1 ? 's' : ''}
          </p>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filtered.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📦</div>
              <p className="text-slate-500">No packages found. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
