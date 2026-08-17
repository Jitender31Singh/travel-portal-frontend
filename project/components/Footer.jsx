'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import { getDestinations } from '@/lib/queries';

export default function Footer() {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    getDestinations()
      .then(data => {
        console.log('[Footer] destinations:', data);
        if (Array.isArray(data)) setDestinations(data);
      })
      .catch(err => console.error('[Footer] Failed to load destinations:', err));
  }, []);

  return (
    <footer className="bg-[#0f2744] text-white">
      <div className="max-w-7xl mx-auto px-5 pt-14 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Goonn<span className="text-[#d97706]">ex</span>Trip
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              Your trusted travel partner for unforgettable treks and thrilling adventures across India.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Facebook, url: process.env.NEXT_PUBLIC_FACEBOOK_URL || '#' },
                { Icon: Instagram, url: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '#' },
                { Icon: Youtube, url: process.env.NEXT_PUBLIC_YOUTUBE_URL || '#' },
              ].map(({ Icon, url }, i) => (
                <a key={i} href={url} target={url !== '#' ? "_blank" : undefined} rel={url !== '#' ? "noopener noreferrer" : undefined}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#0d9488] flex items-center justify-center transition-colors">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-300 mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {[['/', 'Home'], ['/packages', 'Tour Packages'], ['/treks', 'Treks'], ['/about', 'About Us'], ['/contact', 'Contact Us']].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-slate-400 hover:text-[#0d9488] transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-300 mb-4">Destinations</h4>
            <ul className="space-y-2.5 text-sm">
              {destinations.slice(0, 5).map(d => (
                <li key={d.id}>
                  <Link href={`/destinations/${d.slug}`} className="text-slate-400 hover:text-[#0d9488] transition-colors">
                    {d.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-300 mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex gap-3 items-start">
                <Phone size={15} className="text-[#0d9488] mt-0.5 flex-shrink-0" />
                <span>{process.env.NEXT_PUBLIC_CONTACT_PHONE}</span>
              </li>
              <li className="flex gap-3 items-start">
                <Mail size={15} className="text-[#0d9488] mt-0.5 flex-shrink-0" />
                <span>{process.env.NEXT_PUBLIC_CONTACT_EMAIL}</span>
              </li>
              <li className="flex gap-3 items-start">
                <MapPin size={15} className="text-[#0d9488] mt-0.5 flex-shrink-0" />
                <span>{process.env.NEXT_PUBLIC_CONTACT_ADDRESS}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} GoonnexTrip. All Rights Reserved.</p>
          <div className="flex gap-5">
            <Link href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-300 transition-colors">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
