'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, MapPin, Mountain, Package, CalendarDays,
  HelpCircle, Star, Image as ImageIcon, LogOut, Menu, X, ExternalLink
} from 'lucide-react';
import { isAuthenticated, logout } from '@/lib/api';
import { ToastContainer } from '@/components/admin/Toast';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/destinations', label: 'Destinations', icon: MapPin },
  { href: '/admin/treks', label: 'Treks', icon: Mountain },
  { href: '/admin/packages', label: 'Packages', icon: Package },
  { href: '/admin/itinerary', label: 'Itinerary', icon: CalendarDays },
  { href: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/images', label: 'Images', icon: ImageIcon },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') { setReady(true); return; }
    if (!isAuthenticated()) { router.push('/admin/login'); return; }
    setReady(true);
  }, [pathname, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (pathname === '/admin/login') return <>{children}</>;
  if (!ready) return null;

  function handleLogout() {
    logout();
    router.push('/admin/login');
  }

  const isActive = (href) => href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#0f2744] text-white z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}>
        <div className="px-6 py-5 border-b border-white/10">
          <Link href="/admin" className="font-bold text-xl tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Goonn<span className="text-[#d97706]">ex</span> Admin
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(href)
                  ? 'bg-[#0d9488] text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <Link href="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors">
            <ExternalLink size={18} /> View Site
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-red-300 hover:bg-red-500/10 transition-colors">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-slate-100">
            <Menu size={22} className="text-slate-700" />
          </button>
          <span className="font-bold text-[#0f2744]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Admin Panel
          </span>
          <div className="w-8" />
        </header>

        <main className="flex-1 p-5 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
