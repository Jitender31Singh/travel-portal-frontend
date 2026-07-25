'use client';
import Link from 'next/link';
import { Moon, Users, Zap } from 'lucide-react';

export default function PackageCard({ pkg }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <div className="relative h-52 overflow-hidden">
        <img
          src={pkg.coverImage || pkg.cover_image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'}
          alt={pkg.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'; }}
        />
        {pkg.customizable && (
          <span className="badge badge-gold absolute top-3 left-3">Customizable</span>
        )}
        {pkg.destinations?.name && (
          <span className="absolute bottom-3 right-3 text-xs bg-black/50 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
            {pkg.destinations.name}
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-[#0f2744] text-base leading-snug mb-3"
          style={{ fontFamily: "'Playfair Display', serif" }}>{pkg.title}</h3>
        <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-4">
          <span className="flex items-center gap-1"><Moon size={12} /> {pkg.durationNights}N/{pkg.durationDays}D</span>
          {pkg.maxGroupSize && <span className="flex items-center gap-1"><Users size={12} /> Max {pkg.maxGroupSize}</span>}
          {pkg.difficulty && <span className="flex items-center gap-1"><Zap size={12} /> {pkg.difficulty}</span>}
        </div>
        {pkg.overview && (
          <p className="text-xs text-slate-500 line-clamp-2 mb-4">{pkg.overview}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
          <div>
            <span className="text-xl font-bold text-[#0d9488]">₹{Number(pkg.price).toLocaleString('en-IN')}</span>
            <span className="text-xs text-slate-400 ml-1">/person</span>
          </div>
          <Link href={`/packages/${pkg.slug}`}
            className="bg-[#0f2744] hover:bg-[#0d9488] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
