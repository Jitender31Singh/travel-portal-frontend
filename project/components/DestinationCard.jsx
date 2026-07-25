'use client';
import Link from 'next/link';

export default function DestinationCard({ destination }) {
  return (
    <Link href={`/destinations/${destination.slug}`}
      className="relative h-56 rounded-2xl overflow-hidden group block">
      <img
        src={destination.heroImage || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'}
        alt={destination.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white font-bold text-lg leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
          {destination.name}
        </h3>
        {destination.state && (
          <p className="text-white/70 text-xs mt-0.5">{destination.state}</p>
        )}
        <span className="inline-block mt-2 text-xs font-semibold text-[#f59e0b] group-hover:underline">
          Explore →
        </span>
      </div>
    </Link>
  );
}
