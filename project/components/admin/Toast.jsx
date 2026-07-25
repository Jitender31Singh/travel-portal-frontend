'use client';
import { useEffect } from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';

let toastFn = null;

export function toast(message, type = 'success') {
  if (toastFn) toastFn(message, type);
}

export function ToastContainer() {
  useEffect(() => {
    toastFn = (message, type) => {
      const container = document.getElementById('admin-toast-container');
      if (!container) return;
      const el = document.createElement('div');
      el.className = `flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium animate-fade-up`;
      el.style.background = type === 'success' ? '#16a34a' : type === 'error' ? '#dc2626' : '#0d9488';
      const icon = type === 'success' ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>'
        : type === 'error' ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
      el.innerHTML = `${icon}<span>${message}</span>`;
      container.appendChild(el);
      setTimeout(() => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.3s ease';
        setTimeout(() => el.remove(), 300);
      }, 3000);
    };
    return () => { toastFn = null; };
  }, []);

  return <div id="admin-toast-container" className="fixed bottom-6 right-6 z-[300] flex flex-col gap-2" />;
}
