'use client';
import { AlertCircle } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-[#0d9488] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export function ErrorState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <AlertCircle size={40} className="text-red-400 mb-3" />
      <p className="text-slate-500 text-sm">{message || 'Something went wrong.'}</p>
    </div>
  );
}

export function EmptyState({ icon: Icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && <Icon size={40} className="text-slate-300 mb-3" />}
      <p className="text-slate-400 text-sm">{message || 'No data found.'}</p>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
      <div>
        <h1 className="text-2xl font-bold text-[#0f2744]" style={{ fontFamily: "'Playfair Display', serif" }}>{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Badge({ children, color = 'teal' }) {
  const colors = {
    teal: 'bg-teal-50 text-teal-700',
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
    gold: 'bg-amber-50 text-amber-700',
    navy: 'bg-blue-50 text-blue-700',
    gray: 'bg-slate-100 text-slate-600',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[color] || colors.teal}`}>
      {children}
    </span>
  );
}
