'use client';
import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { getFaqs, REF_TYPE } from '@/lib/queries';

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
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

export default function HomeFaqSection({ destinations }: { destinations: any[] }) {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [selectedDestFaq, setSelectedDestFaq] = useState<any>(null);

  useEffect(() => {
    if (destinations && destinations.length > 0) {
      handleFaqTabChange(destinations[0]);
    }
  }, [destinations]);

  async function handleFaqTabChange(dest: any) {
    setSelectedDestFaq(dest);
    setFaqs([]);
    const destFaqs = await getFaqs(dest.id, REF_TYPE.DESTINATION);
    setFaqs(destFaqs || []);
  }

  return (
    <section className="py-20 px-5 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#0f2744]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 mt-2">Common questions answered by destination</p>
        </div>
        {destinations && destinations.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {destinations.map(d => (
              <button key={d.id}
                onClick={() => handleFaqTabChange(d)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${selectedDestFaq?.id === d.id
                  ? 'bg-[#0f2744] text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-[#0d9488] hover:text-[#0d9488]'}`}>
                {d.name}
              </button>
            ))}
          </div>
        )}
        {faqs.length > 0 ? (
          <div className="space-y-3">
            {faqs.map(faq => <FaqItem key={faq.id} question={faq.question} answer={faq.answer} />)}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 text-sm">No FAQs for this destination yet.</div>
        )}
      </div>
    </section>
  );
}
