'use client';
import { useState, useEffect } from 'react';
import { Plus, Mountain, Search } from 'lucide-react';
import { getTreksApi, createTrek, updateTrek, getDestinationsApi } from '@/lib/api';
import { TextField, TextArea, NumberField, SelectField, ArrayField, ImageUploadField } from '@/components/admin/Fields';
import Modal from '@/components/admin/Modal';
import { PageHeader, Badge, LoadingSpinner, ErrorState, EmptyState } from '@/components/admin/Common';
import { toast } from '@/components/admin/Toast';
import { generateSlug } from '@/lib/utils';

const EMPTY = {
  destinationId: '', title: '', slug: '', overview: '', region: '', difficulty: 'Easy',
  durationDays: '', durationNights: '', customizable: false, pickupPoint: '', dropPoint: '',
  distanceKm: '', accommodationType: '', maxGroupSize: '', minAge: '', maxAltitude: '',
  bestMonths: [], transportIncluded: '', cancellationPolicy: '', inclusions: [], exclusions: [],
  thingsToCarry: [], price: '', coverImage: '', active: true, startLocation: '', endLocation: '',
  altitudeGain: '', baseAltitude: '', latitude: '', longitude: '', highlights: [],
};

const DIFFICULTIES = ['Easy', 'Moderate', 'Difficult', 'Challenging'];

export default function AdminTreks() {
  const [treks, setTreks] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const [t, d] = await Promise.all([getTreksApi(), getDestinationsApi()]);
      setTreks(Array.isArray(t) ? t : []);
      setDestinations(Array.isArray(d) ? d : []);
    } catch (err) {
      setError('Failed to load treks.');
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setForm(EMPTY);
    setModalOpen(true);
  }

  function openEdit(trek) {
    setForm({ ...EMPTY, ...trek });
    setModalOpen(true);
  }

  function handleTitleChange(val) {
    setForm(f => ({
      ...f,
      title: val,
      slug: !f.id || !f.slug || f.slug === generateSlug(f.title) ? generateSlug(val) : f.slug,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        durationDays: form.durationDays ? Number(form.durationDays) : null,
        durationNights: form.durationNights ? Number(form.durationNights) : null,
        distanceKm: form.distanceKm ? Number(form.distanceKm) : null,
        maxGroupSize: form.maxGroupSize ? Number(form.maxGroupSize) : null,
        minAge: form.minAge ? Number(form.minAge) : null,
        maxAltitude: form.maxAltitude ? Number(form.maxAltitude) : null,
        altitudeGain: form.altitudeGain ? Number(form.altitudeGain) : null,
        baseAltitude: form.baseAltitude ? Number(form.baseAltitude) : null,
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
        price: form.price ? Number(form.price) : null,
      };
      if (form.id) {
        await updateTrek(form.id, payload);
        toast('Trek updated successfully');
      } else {
        await createTrek(payload);
        toast('Trek created successfully');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast(form.id ? 'Failed to update trek' : 'Failed to create trek', 'error');
    } finally {
      setSaving(false);
    }
  }

  const filtered = treks.filter(t =>
    !search || t.title?.toLowerCase().includes(search.toLowerCase()) || t.region?.toLowerCase().includes(search.toLowerCase())
  );

  const destName = (id) => destinations.find(d => d.id === id)?.name || '—';

  return (
    <div>
      <PageHeader
        title="Treks"
        subtitle={`${treks.length} trek${treks.length !== 1 ? 's' : ''} total`}
        action={
          <button onClick={openCreate} className="flex items-center gap-2 bg-[#0d9488] hover:bg-[#0a7a70] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors">
            <Plus size={16} /> Add Trek
          </button>
        }
      />

      <div className="mb-5 relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search treks…"
          className="w-full border border-slate-200 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]" />
      </div>

      {loading ? <LoadingSpinner /> : error ? <ErrorState message={error} /> : filtered.length === 0 ? (
        <EmptyState icon={Mountain} message="No treks found. Click 'Add Trek' to create one." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(t => (
            <div key={t.id} onClick={() => openEdit(t)} className="bg-white rounded-2xl border border-slate-100 overflow-hidden card-hover cursor-pointer">
              {t.coverImage ? (
                <img src={t.coverImage} alt={t.title} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-slate-100 flex items-center justify-center">
                  <Mountain size={32} className="text-slate-300" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-[#0f2744] text-sm">{t.title}</h3>
                  <Badge color={t.active ? 'green' : 'gray'}>{t.active ? 'Active' : 'Inactive'}</Badge>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {t.difficulty && <Badge color="teal">{t.difficulty}</Badge>}
                  {t.durationDays && <span className="text-xs text-slate-500">{t.durationDays}D / {t.durationNights || 0}N</span>}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{destName(t.destinationId)}</span>
                  {t.price && <span className="font-bold text-[#0d9488]">₹{Number(t.price).toLocaleString('en-IN')}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={form.id ? "Edit Trek" : "Add Trek"} size="xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <TextField label="Title" value={form.title} onChange={handleTitleChange} required placeholder="e.g. Hampta Pass Trek" />
            <TextField label="Slug" value={form.slug} onChange={v => setForm(f => ({ ...f, slug: v }))} required placeholder="e.g. hampta-pass" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <SelectField label="Destination" value={form.destinationId} onChange={v => setForm(f => ({ ...f, destinationId: v }))}
              options={destinations.map(d => ({ value: d.id, label: d.name }))} placeholder="Select destination" />
            <TextField label="Region" value={form.region} onChange={v => setForm(f => ({ ...f, region: v }))} placeholder="e.g. Himachal" />
            <SelectField label="Difficulty" value={form.difficulty} onChange={v => setForm(f => ({ ...f, difficulty: v }))} options={DIFFICULTIES} />
          </div>
          <TextArea label="Overview" value={form.overview} onChange={v => setForm(f => ({ ...f, overview: v }))} rows={3} />
          <div className="grid grid-cols-4 gap-4">
            <NumberField label="Duration (Days)" value={form.durationDays} onChange={v => setForm(f => ({ ...f, durationDays: v }))} />
            <NumberField label="Nights" value={form.durationNights} onChange={v => setForm(f => ({ ...f, durationNights: v }))} />
            <NumberField label="Price (₹)" value={form.price} onChange={v => setForm(f => ({ ...f, price: v }))} />
            <NumberField label="Distance (km)" value={form.distanceKm} onChange={v => setForm(f => ({ ...f, distanceKm: v }))} step="0.1" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <NumberField label="Max Group Size" value={form.maxGroupSize} onChange={v => setForm(f => ({ ...f, maxGroupSize: v }))} />
            <NumberField label="Min Age" value={form.minAge} onChange={v => setForm(f => ({ ...f, minAge: v }))} />
            <NumberField label="Max Altitude (ft)" value={form.maxAltitude} onChange={v => setForm(f => ({ ...f, maxAltitude: v }))} />
            <NumberField label="Altitude Gain" value={form.altitudeGain} onChange={v => setForm(f => ({ ...f, altitudeGain: v }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TextField label="Pickup Point" value={form.pickupPoint} onChange={v => setForm(f => ({ ...f, pickupPoint: v }))} />
            <TextField label="Drop Point" value={form.dropPoint} onChange={v => setForm(f => ({ ...f, dropPoint: v }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TextField label="Start Location" value={form.startLocation} onChange={v => setForm(f => ({ ...f, startLocation: v }))} />
            <TextField label="End Location" value={form.endLocation} onChange={v => setForm(f => ({ ...f, endLocation: v }))} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <TextField label="Accommodation" value={form.accommodationType} onChange={v => setForm(f => ({ ...f, accommodationType: v }))} />
            <TextField label="Transport Included" value={form.transportIncluded} onChange={v => setForm(f => ({ ...f, transportIncluded: v }))} />
            <TextField label="Base Altitude" value={form.baseAltitude} onChange={v => setForm(f => ({ ...f, baseAltitude: v }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TextField label="Latitude" value={form.latitude} onChange={v => setForm(f => ({ ...f, latitude: v }))} step="0.000001" />
            <TextField label="Longitude" value={form.longitude} onChange={v => setForm(f => ({ ...f, longitude: v }))} step="0.000001" />
          </div>
          <ImageUploadField label="Cover Image URL" value={form.coverImage} onChange={v => setForm(f => ({ ...f, coverImage: v }))} />
          <TextArea label="Cancellation Policy" value={form.cancellationPolicy} onChange={v => setForm(f => ({ ...f, cancellationPolicy: v }))} rows={2} />
          <div className="grid grid-cols-2 gap-4">
            <ArrayField label="Best Months" value={form.bestMonths} onChange={v => setForm(f => ({ ...f, bestMonths: v }))} placeholder="e.g. May" />
            <ArrayField label="Highlights" value={form.highlights} onChange={v => setForm(f => ({ ...f, highlights: v }))} placeholder="e.g. Scenic views" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <ArrayField label="Inclusions" value={form.inclusions} onChange={v => setForm(f => ({ ...f, inclusions: v }))} placeholder="e.g. Meals" />
            <ArrayField label="Exclusions" value={form.exclusions} onChange={v => setForm(f => ({ ...f, exclusions: v }))} placeholder="e.g. Flights" />
            <ArrayField label="Things to Carry" value={form.thingsToCarry} onChange={v => setForm(f => ({ ...f, thingsToCarry: v }))} placeholder="e.g. Trekking poles" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="customizable" checked={form.customizable} onChange={e => setForm(f => ({ ...f, customizable: e.target.checked }))} className="w-4 h-4 accent-[#0d9488]" />
            <label htmlFor="customizable" className="text-sm text-slate-600">Customizable</label>
            <input type="checkbox" id="active" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="w-4 h-4 accent-[#0d9488] ml-4" />
            <label htmlFor="active" className="text-sm text-slate-600">Active</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)}
              className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-[#0d9488] hover:bg-[#0a7a70] disabled:opacity-60 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
              {saving ? 'Saving…' : form.id ? 'Save Changes' : 'Create Trek'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
