'use client';
import Link from 'next/link';
import { Calendar, Mountain, Map } from 'lucide-react';

const diffClass = {
  easy: 'badge-easy',
  moderate: 'badge-moderate',
  difficult: 'badge-difficult',
  challenging: 'badge-challenging',
};

export default function TrekCard({ trek }) {
  const dc = diffClass[(trek.difficulty || '').toLowerCase()] || 'badge-teal';

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <div className="relative h-52 overflow-hidden">
        <img
          src={trek.coverImage || trek.cover_image || 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80'}
          alt={trek.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80'; }}
        />
        {trek.difficulty && (
          <span className={`badge ${dc} absolute top-3 left-3`}>{trek.difficulty}</span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-[#0f2744] text-base leading-snug mb-3"
          style={{ fontFamily: "'Playfair Display', serif" }}>{trek.title}</h3>
        <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-4">
          <span className="flex items-center gap-1"><Calendar size={12} /> {trek.duration_days} Days</span>
          {trek.distance_km && <span className="flex items-center gap-1"><Map size={12} /> {trek.distance_km} km</span>}
          {trek.max_altitude && <span className="flex items-center gap-1"><Mountain size={12} /> {trek.max_altitude.toLocaleString()} ft</span>}
        </div>
        {trek.best_time && (
          <p className="text-xs text-slate-400 mb-4">Best time: {trek.best_time}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
          <div>
            <span className="text-xl font-bold text-[#0d9488]">₹{Number(trek.price).toLocaleString('en-IN')}</span>
            <span className="text-xs text-slate-400 ml-1">/person</span>
          </div>
          <Link href={`/treks/${trek.slug}`}
            className="bg-[#0f2744] hover:bg-[#0d9488] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
