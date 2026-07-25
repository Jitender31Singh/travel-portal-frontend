'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Phone } from 'lucide-react';
import { useEnquiry } from './EnquiryContext';
import { getDestinations } from '@/lib/queries';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [destOpen, setDestOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const pathname = usePathname();
  const { openModal } = useEnquiry();

  useEffect(() => {
    getDestinations().then(setDestinations);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDestOpen(false);
  }, [pathname]);

  const isHome = pathname === '/';
  const navBg = scrolled || !isHome
    ? 'bg-white shadow-md text-slate-800'
    : 'bg-transparent text-white';
  const logoColor = scrolled || !isHome ? 'text-[#0f2744]' : 'text-white';
  const linkColor = scrolled || !isHome ? 'text-slate-700 hover:text-[#0d9488]' : 'text-white/90 hover:text-white';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-5 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className={`font-bold text-xl tracking-tight transition-colors ${logoColor}`}
          style={{ fontFamily: "'Playfair Display', serif" }}>
          Goonn<span className="text-[#d97706]">ex</span>Trip
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {[['/', 'Home'], ['/treks', 'Treks'], ['/packages', 'Packages'], ['/about', 'About'], ['/contact', 'Contact']].map(([href, label]) => (
            <li key={href}>
              <Link href={href}
                className={`transition-colors pb-1 border-b-2 ${pathname === href ? 'border-[#0d9488] text-[#0d9488]' : `border-transparent ${linkColor}`}`}>
                {label}
              </Link>
            </li>
          ))}

          {/* Destinations dropdown */}
          <li className="relative"
            onMouseEnter={() => setDestOpen(true)}
            onMouseLeave={() => setDestOpen(false)}>
            <button className={`flex items-center gap-1 transition-colors pb-1 border-b-2 border-transparent ${linkColor}`}>
              Destinations <ChevronDown size={14} className={`transition-transform ${destOpen ? 'rotate-180' : ''}`} />
            </button>
            {destOpen && destinations.length > 0 && (
              <div className="absolute top-full left-0 mt-1 bg-white text-slate-800 shadow-xl rounded-xl py-2 min-w-[180px] border border-slate-100">
                {destinations.map(d => (
                  <Link key={d.id} href={`/destinations/${d.slug}`}
                    className="block px-4 py-2.5 text-sm hover:bg-slate-50 hover:text-[#0d9488] transition-colors">
                    {d.name}
                  </Link>
                ))}
              </div>
            )}
          </li>

          <li>
            <button onClick={() => openModal()}
              className="flex items-center gap-2 bg-[#d97706] hover:bg-[#b45309] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
              <Phone size={14} /> Enquire Now
            </button>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button className="lg:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu">
          {menuOpen
            ? <X size={22} className={scrolled || !isHome ? 'text-slate-800' : 'text-white'} />
            : <Menu size={22} className={scrolled || !isHome ? 'text-slate-800' : 'text-white'} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-lg">
          <div className="px-5 py-4 flex flex-col gap-1">
            {[['/', 'Home'], ['/treks', 'Treks'], ['/packages', 'Packages'], ['/about', 'About'], ['/contact', 'Contact']].map(([href, label]) => (
              <Link key={href} href={href}
                className={`py-2.5 text-sm font-medium border-b border-slate-50 ${pathname === href ? 'text-[#0d9488]' : 'text-slate-700'}`}>
                {label}
              </Link>
            ))}
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-3 mb-1">Destinations</p>
            {destinations.map(d => (
              <Link key={d.id} href={`/destinations/${d.slug}`}
                className="py-2 text-sm text-slate-600 hover:text-[#0d9488] pl-2">
                {d.name}
              </Link>
            ))}
            <button onClick={() => { setMenuOpen(false); openModal(); }}
              className="mt-3 w-full bg-[#d97706] text-white py-2.5 rounded-lg text-sm font-semibold">
              Enquire Now
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
