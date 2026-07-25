import Link from 'next/link';
import { Shield, Leaf, Compass, Star, Heart, Users } from 'lucide-react';

export default function AboutPage() {
  const values = [
    { icon: Shield, title: 'Safety First', desc: 'Your safety is our top priority on all treks and tours. Every route is vetted by experts.' },
    { icon: Leaf, title: 'Eco-Friendly', desc: 'We promote responsible and sustainable travel practices that respect nature.' },
    { icon: Compass, title: 'Expert Guidance', desc: 'Experienced local guides who know every trail, every shortcut, every viewpoint.' },
    { icon: Star, title: 'Best Quality', desc: 'Premium service and experiences at every touchpoint, every single time.' },
    { icon: Heart, title: 'Customer First', desc: 'We always put your happiness and comfort above everything else.' },
    { icon: Users, title: 'Community', desc: 'We build lasting bonds between travelers, guides, and local communities.' },
  ];

  const stats = [
    ['10K+', 'Happy Trekkers'],
    ['50+', 'Amazing Treks'],
    ['4.8★', 'Average Rating'],
    ['100%', 'Safe & Secure'],
  ];

  const team = [
    { name: 'Ravi Kumar', role: 'Founder & Chief Guide', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80' },
    { name: 'Sunita Negi', role: 'Head of Operations', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80' },
    { name: 'Amit Rawat', role: 'Lead Trek Expert', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80' },
  ];

  return (
    <div>
      {/* Banner */}
      <div className="relative h-72 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1522163182402-834f871fd851?w=1600&q=80"
          alt="About" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f2744]/70 to-[#0f2744]/90" />
        <div className="absolute inset-0 flex flex-col justify-center px-5 md:px-12 pt-16">
          <nav className="flex items-center gap-2 text-white/60 text-xs mb-3">
            <Link href="/" className="hover:text-white">Home</Link><span>/</span><span className="text-white">About</span>
          </nav>
          <h1 className="text-4xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>About GoonnexTrip</h1>
          <p className="text-white/70 mt-2">Your trusted travel partner for unforgettable adventures across India.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-[#0f2744] py-10 px-5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map(([number, label]) => (
            <div key={number}>
              <div className="text-3xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{number}</div>
              <div className="text-slate-400 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Story */}
      <section className="py-20 px-5">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#d97706]">Our Story</span>
            <h2 className="text-3xl font-bold text-[#0f2744] mt-3 mb-5"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              Born from a Passion<br />for the Mountains
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              GoonnexTrip was born out of a deep passion for the Himalayas and a heartfelt desire to share the magic of trekking and travel with everyone. What started as a small group of adventure enthusiasts has grown into one of India&apos;s most trusted adventure travel companies.
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              We believe that every journey has the power to transform you. That&apos;s why our focus remains on providing safe, memorable, and responsible travel experiences that connect people with nature and with themselves.
            </p>
            <blockquote className="border-l-4 border-[#d97706] pl-5 italic text-[#0f2744] font-medium">
              &ldquo;The mountains are calling, and we are here to take you there.&rdquo;
            </blockquote>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img src="https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=800&q=80"
              alt="Trekking" className="w-full h-[420px] object-cover" />
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-5 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0f2744]" style={{ fontFamily: "'Playfair Display', serif" }}>Our Core Values</h2>
            <p className="text-slate-500 mt-2">Principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-[#0d9488]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} className="text-[#0d9488]" />
                </div>
                <h4 className="font-semibold text-[#0f2744] mb-2">{title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0f2744]" style={{ fontFamily: "'Playfair Display', serif" }}>Meet Our Team</h2>
            <p className="text-slate-500 mt-2">Passionate people behind unforgettable adventures</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map(({ name, role, img }) => (
              <div key={name} className="text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 shadow-lg border-4 border-white ring-2 ring-slate-100">
                  <img src={img} alt={name} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-semibold text-[#0f2744] text-lg">{name}</h4>
                <p className="text-slate-500 text-sm">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#0f2744] to-[#0d9488] py-20 px-5 text-center">
        <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          Ready for Your Next Adventure?
        </h2>
        <p className="text-white/70 mb-6">Let us help you plan the perfect trip across India.</p>
        <Link href="/contact"
          className="inline-block bg-[#d97706] hover:bg-[#b45309] text-white font-semibold px-8 py-3.5 rounded-xl transition-all hover:shadow-lg">
          Contact Us
        </Link>
      </section>
    </div>
  );
}
