'use client';
import Link from 'next/link';
import { useEnquiry } from '@/components/EnquiryContext';

export function HeroButtons() {
  const { openModal } = useEnquiry();
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link href="/treks"
        className="bg-[#0d9488] hover:bg-[#0a7a70] text-white font-semibold px-8 py-3.5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5">
        Explore Treks
      </Link>
      <button onClick={() => openModal()}
        className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl transition-all">
        Plan My Trip ✈
      </button>
    </div>
  );
}

export function CtaButton() {
  const { openModal } = useEnquiry();
  return (
    <button onClick={() => openModal()}
      className="bg-[#d97706] hover:bg-[#b45309] text-white font-semibold px-10 py-4 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5">
      Plan Your Trip ✈
    </button>
  );
}
