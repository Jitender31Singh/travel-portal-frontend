'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react';
import { submitEnquiry } from '@/lib/queries';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '', travelers: '', travelDate: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await submitEnquiry({
      name: form.name,
      email: form.email,
      phone: form.phone,
      subject: form.subject,
      message: form.message,
      travelers: form.travelers,
      travelDate: form.travelDate || null,
    });
    setLoading(false);
    if (result) {
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '', travelers: '', travelDate: '' });
    } else {
      setError('Failed to send message. Please try again or call us directly.');
    }
  }

  const contactInfo = [
    { icon: Phone, label: 'Phone', value: `${process.env.NEXT_PUBLIC_CONTACT_PHONE}`, sub: 'Mon–Sat: 9AM–7PM' },
    { icon: Mail, label: 'Email', value: `${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`, sub: 'We reply within 24 hours' },
    { icon: MapPin, label: 'Address', value: `${process.env.NEXT_PUBLIC_CONTACT_ADDRESS}`, sub: 'Dehradun, Uttarakhand 248001' },
    { icon: Clock, label: 'Office Hours', value: 'Mon–Sat: 9AM–7PM', sub: 'Sunday: 10AM–4PM' },
  ];

  return (
    <div>
      {/* Banner */}
      <div className="relative h-72 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=80"
          alt="Contact" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f2744]/70 to-[#0f2744]/90" />
        <div className="absolute inset-0 flex flex-col justify-center px-5 md:px-12 pt-16">
          <nav className="flex items-center gap-2 text-white/60 text-xs mb-3">
            <Link href="/" className="hover:text-white">Home</Link><span>/</span><span className="text-white">Contact</span>
          </nav>
          <h1 className="text-4xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>We&apos;d Love to Hear From You</h1>
          <p className="text-white/70 mt-2">Have questions? Our travel experts are always ready to help.</p>
        </div>
      </div>

      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-12">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#0f2744] mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}>Get in Touch</h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Our travel experts are ready to help you plan the perfect trip. Reach out anytime!
              </p>
            </div>

            {contactInfo.map(({ icon: Icon, label, value, sub }) => (
              <div key={label} className="flex gap-4 items-start">
                <div className="w-11 h-11 bg-[#0d9488]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-[#0d9488]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-[#0f2744]">{value}</p>
                  <p className="text-xs text-slate-400">{sub}</p>
                </div>
              </div>
            ))}

            <div className="bg-[#0f2744] rounded-2xl p-5 text-white mt-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle size={18} className="text-[#f59e0b]" />
                <span className="font-semibold text-sm">Still have questions?</span>
              </div>
              <p className="text-white/70 text-xs mb-4">We offer 24/7 personalized support. Chat on WhatsApp for instant replies.</p>
              <a href="https://wa.me/9818097594?text=Hello!%20I%20would%20like%20to%20know%20more%20about%20your%20travel%20packages." target="_blank" rel="noopener noreferrer"
                className="inline-block bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
                💬 Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
              <div className="bg-gradient-to-r from-[#0f2744] to-[#1a3a5c] px-6 py-5">
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Send Us a Message</h3>
                <p className="text-white/60 text-sm mt-1">We&apos;ll get back to you within 24 hours.</p>
              </div>

              {success ? (
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4">✈️</div>
                  <h3 className="text-xl font-bold text-[#0f2744] mb-2">Message Sent!</h3>
                  <p className="text-slate-500 text-sm">Our team will contact you within 24 hours.</p>
                  <button onClick={() => setSuccess(false)}
                    className="mt-6 text-[#0d9488] text-sm hover:underline">Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Full Name *</label>
                      <input name="name" value={form.name} onChange={handleChange} required
                        placeholder="Your name"
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Email *</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} required
                        placeholder="your@email.com"
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Phone *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} required
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Interested In</label>
                    <input name="subject" value={form.subject} onChange={handleChange}
                      placeholder="Package / Trek name (optional)"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Travel Date</label>
                      <input name="travelDate" type="date" value={form.travelDate} onChange={handleChange}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Travelers</label>
                      <select name="travelers" value={form.travelers} onChange={handleChange}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]">
                        <option value="">Select</option>
                        {['1', '2', '3-5', '6-10', '10+'].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Message</label>
                    <textarea name="message" value={form.message} onChange={handleChange} rows={4}
                      placeholder="Tell us about your dream trip…"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488] resize-none" />
                  </div>
                  {error && <p className="text-red-600 text-xs">{error}</p>}
                  <button type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-[#d97706] hover:bg-[#b45309] disabled:opacity-60 text-white py-3.5 rounded-xl font-semibold transition-colors">
                    {loading ? 'Sending…' : <><Send size={16} /> Send Message</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
