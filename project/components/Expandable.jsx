'use client';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function Expandable({ children, maxHeight = 250 }) {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        setIsOverflowing(contentRef.current.scrollHeight > maxHeight);
      }
    };
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [children, maxHeight]);

  return (
    <div className="relative">
      <div 
        ref={contentRef}
        className={`overflow-hidden transition-all duration-300 relative`}
        style={{ maxHeight: expanded ? '20000px' : (isOverflowing ? `${maxHeight}px` : 'none') }}
      >
        {children}
        {!expanded && isOverflowing && (
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        )}
      </div>
      {isOverflowing && (
        <button 
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center gap-1 text-sm font-semibold text-[#0d9488] hover:text-[#0a7a70] transition-colors bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm"
        >
          {expanded ? (
            <>Read Less <ChevronUp size={16} /></>
          ) : (
            <>Read More <ChevronDown size={16} /></>
          )}
        </button>
      )}
    </div>
  );
}
