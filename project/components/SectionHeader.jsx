import Link from 'next/link';

export default function SectionHeader({ title, subtitle, viewAllHref, viewAllLabel = 'View All →' }) {
  return (
    <div className="flex items-end justify-between mb-8 gap-4">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#0f2744]"
          style={{ fontFamily: "'Playfair Display', serif" }}>{title}</h2>
        {subtitle && <p className="text-slate-500 text-sm md:text-base mt-1">{subtitle}</p>}
      </div>
      {viewAllHref && (
        <Link href={viewAllHref}
          className="text-sm font-semibold text-[#0d9488] hover:text-[#0f2744] transition-colors whitespace-nowrap">
          {viewAllLabel}
        </Link>
      )}
    </div>
  );
}
