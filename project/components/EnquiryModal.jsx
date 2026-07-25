'use client';
import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { useEnquiry } from './EnquiryContext';
import { submitEnquiry } from '@/lib/queries';

export default function EnquiryModal() {
  const { open, prefill, closeModal } = useEnquiry();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '', travelers: '', travelDate: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

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
      subject: form.subject || prefill,
      message: form.message,
      travelers: form.travelers,
      travel_date: form.travelDate || null,
    });
    setLoading(false);
    if (result) {
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '', travelers: '', travelDate: '' });
      setTimeout(() => { setSuccess(false); closeModal(); }, 2500);
    } else {
      setError('Failed to send. Please try again or call us directly.');
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && closeModal()}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl relative">
        <div className="bg-gradient-to-r from-[#0f2744] to-[#1a3a5c] text-white px-6 py-5 rounded-t-2xl">
          <button onClick={closeModal}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
            <X size={20} />
          </button>
          <h2 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Plan Your Trip</h2>
          <p className="text-white/70 text-sm mt-1">Fill in your details and our travel experts will contact you shortly.</p>
        </div>

        {success ? (
          <div className="p-10 text-center">
            <div className="text-5xl mb-4">✈️</div>
            <h3 className="text-xl font-semibold text-[#0f2744] mb-2">Enquiry Sent!</h3>
            <p className="text-slate-500 text-sm">Our team will get back to you within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required
                  placeholder="Your name"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Phone *</label>
                <input name="phone" value={form.phone} onChange={handleChange} required
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required
                placeholder="your@email.com"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Interested In</label>
              <input name="subject" value={form.subject || prefill} onChange={handleChange}
                placeholder="Package / Trek name (optional)"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Travel Date</label>
                <input name="travelDate" type="date" value={form.travelDate} onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Travelers</label>
                <select name="travelers" value={form.travelers} onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent">
                  <option value="">Select</option>
                  {['1', '2', '3-5', '6-10', '10+'].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Message</label>
              <textarea name="message" value={form.message} onChange={handleChange} rows={3}
                placeholder="Tell us about your dream trip…"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent resize-none" />
            </div>
            {error && <p className="text-red-600 text-xs">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#d97706] hover:bg-[#b45309] disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition-colors">
              {loading ? 'Sending…' : <><Send size={16} /> Send Enquiry</>}
            </button>
            <p className="text-center text-xs text-slate-400">🛡 Your details are safe with us. No spam, ever.</p>
          </form>
        )}
      </div>
    </div>
  );
}
