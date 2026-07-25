'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import TrekCard from '@/components/TrekCard';
import { getTreks } from '@/lib/queries';

const DIFFICULTIES = ['', 'Easy', 'Moderate', 'Difficult', 'Challenging'];
const DURATIONS = [
  { label: 'Any Duration', value: '' },
  { label: '1–3 Days', value: '1-3' },
  { label: '4–7 Days', value: '4-7' },
  { label: '8–14 Days', value: '8-14' },
  { label: '15+ Days', value: '15+' },
];

export default function TreksPage() {
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [duration, setDuration] = useState('');

  useEffect(() => {
    getTreks().then(t => { setTreks(t); setLoading(false); });
  }, []);

  const filtered = treks.filter(t => {
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase());
    const matchDiff = !difficulty || t.difficulty?.toLowerCase() === difficulty.toLowerCase();
    let matchDur = true;
    if (duration) {
      const d = t.duration_days || 0;
      if (duration === '1-3') matchDur = d >= 1 && d <= 3;
      else if (duration === '4-7') matchDur = d >= 4 && d <= 7;
      else if (duration === '8-14') matchDur = d >= 8 && d <= 14;
      else if (duration === '15+') matchDur = d >= 15;
    }
    return matchSearch && matchDiff && matchDur;
  });

  return (
    <div>
      {/* Banner */}
      <div className="relative h-72 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=1600&q=80"
          alt="Treks" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f2744]/70 to-[#0f2744]/90" />
        <div className="absolute inset-0 flex flex-col justify-center px-5 md:px-12 pt-16">
          <nav className="flex items-center gap-2 text-white/60 text-xs mb-3">
            <Link href="/" className="hover:text-white">Home</Link><span>/</span><span className="text-white">Treks</span>
          </nav>
          <h1 className="text-4xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Explore the Best Treks</h1>
          <p className="text-white/70 mt-2">Breathtaking trails across India. Adventure, nature, unforgettable memories.</p>
        </div>
      </div>

      <section className="py-16 px-5">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-8 flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Search</label>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search trek name…"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]" />
            </div>
            <div className="min-w-[160px]">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Difficulty</label>
              <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]">
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d || 'All Difficulty'}</option>)}
              </select>
            </div>
            <div className="min-w-[160px]">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Duration</label>
              <select value={duration} onChange={e => setDuration(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]">
                {DURATIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
            <button onClick={() => { setSearch(''); setDifficulty(''); setDuration(''); }}
              className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:border-[#0d9488] hover:text-[#0d9488] transition-colors">
              Clear
            </button>
          </div>

          <p className="text-sm text-slate-500 mb-6">
            Showing <strong>{filtered.length}</strong> trek{filtered.length !== 1 ? 's' : ''}
          </p>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton rounded-2xl h-[340px]" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filtered.map(t => <TrekCard key={t.id} trek={t} />)}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🏔️</div>
              <p className="text-slate-500">No treks found. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
