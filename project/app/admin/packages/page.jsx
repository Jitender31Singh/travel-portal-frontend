'use client';
import { useState, useEffect } from 'react';
import { Plus, Package, Search } from 'lucide-react';
import { getPackagesApi, createPackage, updatePackage, getDestinationsApi } from '@/lib/api';
import { TextField, TextArea, NumberField, SelectField, ArrayField, ImageUploadField } from '@/components/admin/Fields';
import Modal from '@/components/admin/Modal';
import { PageHeader, Badge, LoadingSpinner, ErrorState, EmptyState } from '@/components/admin/Common';
import { toast } from '@/components/admin/Toast';
import { generateSlug } from '@/lib/utils';

const EMPTY = {
  destinationId: '', title: '', slug: '', overview: '', price: '',
  durationDays: '', durationNights: '', inclusions: [], exclusions: [],
  pickupPoint: '', dropPoint: '', bestTimeToVisit: '', accommodationType: '',
  transportIncluded: '', maxGroupSize: '', minAge: '', thingsToCarry: [],
  difficulty: 'Easy', cancellationPolicy: '', termsAndConditions: '',
  coverImage: '', customizable: false, active: true,
};

const DIFFICULTIES = ['Easy', 'Moderate', 'Difficult', 'Challenging'];

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);
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
      const [p, d] = await Promise.all([getPackagesApi(), getDestinationsApi()]);
      setPackages(Array.isArray(p) ? p : []);
      setDestinations(Array.isArray(d) ? d : []);
    } catch (err) {
      setError('Failed to load packages.');
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setForm(EMPTY);
    setModalOpen(true);
  }

  function openEdit(pkg) {
    setForm({ ...EMPTY, ...pkg });
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
        price: form.price ? Number(form.price) : null,
        durationDays: form.durationDays ? Number(form.durationDays) : null,
        durationNights: form.durationNights ? Number(form.durationNights) : null,
        maxGroupSize: form.maxGroupSize ? Number(form.maxGroupSize) : null,
        minAge: form.minAge ? Number(form.minAge) : null,
      };
      if (form.id) {
        await updatePackage(form.id, payload);
        toast('Package updated successfully');
      } else {
        await createPackage(payload);
        toast('Package created successfully');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast(form.id ? 'Failed to update package' : 'Failed to create package', 'error');
    } finally {
      setSaving(false);
    }
  }

  const filtered = packages.filter(p =>
    !search || p.title?.toLowerCase().includes(search.toLowerCase())
  );

  const destName = (id) => destinations.find(d => d.id === id)?.name || '—';

  return (
    <div>
      <PageHeader
        title="Tour Packages"
        subtitle={`${packages.length} package${packages.length !== 1 ? 's' : ''} total`}
        action={
          <button onClick={openCreate} className="flex items-center gap-2 bg-[#0d9488] hover:bg-[#0a7a70] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors">
            <Plus size={16} /> Add Package
          </button>
        }
      />

      <div className="mb-5 relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search packages…"
          className="w-full border border-slate-200 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]" />
      </div>

      {loading ? <LoadingSpinner /> : error ? <ErrorState message={error} /> : filtered.length === 0 ? (
        <EmptyState icon={Package} message="No packages found. Click 'Add Package' to create one." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(p => (
            <div key={p.id} onClick={() => openEdit(p)} className="bg-white rounded-2xl border border-slate-100 overflow-hidden card-hover cursor-pointer">
              {p.coverImage ? (
                <img src={p.coverImage} alt={p.title} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-slate-100 flex items-center justify-center">
                  <Package size={32} className="text-slate-300" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-[#0f2744] text-sm">{p.title}</h3>
                  <Badge color={p.active ? 'green' : 'gray'}>{p.active ? 'Active' : 'Inactive'}</Badge>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {p.difficulty && <Badge color="teal">{p.difficulty}</Badge>}
                  {p.durationDays && <span className="text-xs text-slate-500">{p.durationDays}D / {p.durationNights || 0}N</span>}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{destName(p.destinationId)}</span>
                  {p.price && <span className="font-bold text-[#0d9488]">₹{Number(p.price).toLocaleString('en-IN')}</span>}
                </div>
                {p.rating != null && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-amber-500">
                    ★ {p.rating.toFixed(1)} ({p.reviewCount || 0} reviews)
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={form.id ? "Edit Package" : "Add Package"} size="xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <TextField label="Title" value={form.title} onChange={handleTitleChange} required placeholder="e.g. Manali Holiday Package" />
            <TextField label="Slug" value={form.slug} onChange={v => setForm(f => ({ ...f, slug: v }))} required placeholder="e.g. manali-holiday" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <SelectField label="Destination" value={form.destinationId} onChange={v => setForm(f => ({ ...f, destinationId: v }))}
              options={destinations.map(d => ({ value: d.id, label: d.name }))} placeholder="Select destination" />
            <SelectField label="Difficulty" value={form.difficulty} onChange={v => setForm(f => ({ ...f, difficulty: v }))} options={DIFFICULTIES} />
            <TextField label="Best Time to Visit" value={form.bestTimeToVisit} onChange={v => setForm(f => ({ ...f, bestTimeToVisit: v }))} placeholder="e.g. Oct–Jun" />
          </div>
          <TextArea label="Overview" value={form.overview} onChange={v => setForm(f => ({ ...f, overview: v }))} rows={3} />
          <div className="grid grid-cols-4 gap-4">
            <NumberField label="Price (₹)" value={form.price} onChange={v => setForm(f => ({ ...f, price: v }))} />
            <NumberField label="Duration (Days)" value={form.durationDays} onChange={v => setForm(f => ({ ...f, durationDays: v }))} />
            <NumberField label="Nights" value={form.durationNights} onChange={v => setForm(f => ({ ...f, durationNights: v }))} />
            <NumberField label="Max Group Size" value={form.maxGroupSize} onChange={v => setForm(f => ({ ...f, maxGroupSize: v }))} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <TextField label="Pickup Point" value={form.pickupPoint} onChange={v => setForm(f => ({ ...f, pickupPoint: v }))} />
            <TextField label="Drop Point" value={form.dropPoint} onChange={v => setForm(f => ({ ...f, dropPoint: v }))} />
            <NumberField label="Min Age" value={form.minAge} onChange={v => setForm(f => ({ ...f, minAge: v }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TextField label="Accommodation" value={form.accommodationType} onChange={v => setForm(f => ({ ...f, accommodationType: v }))} />
            <TextField label="Transport Included" value={form.transportIncluded} onChange={v => setForm(f => ({ ...f, transportIncluded: v }))} />
          </div>
          <ImageUploadField label="Cover Image URL" value={form.coverImage} onChange={v => setForm(f => ({ ...f, coverImage: v }))} />
          <div className="grid grid-cols-3 gap-4">
            <ArrayField label="Inclusions" value={form.inclusions} onChange={v => setForm(f => ({ ...f, inclusions: v }))} placeholder="e.g. Meals" />
            <ArrayField label="Exclusions" value={form.exclusions} onChange={v => setForm(f => ({ ...f, exclusions: v }))} placeholder="e.g. Flights" />
            <ArrayField label="Things to Carry" value={form.thingsToCarry} onChange={v => setForm(f => ({ ...f, thingsToCarry: v }))} placeholder="e.g. Warm clothes" />
          </div>
          <TextArea label="Cancellation Policy" value={form.cancellationPolicy} onChange={v => setForm(f => ({ ...f, cancellationPolicy: v }))} rows={2} />
          <TextArea label="Terms & Conditions" value={form.termsAndConditions} onChange={v => setForm(f => ({ ...f, termsAndConditions: v }))} rows={2} />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="pkg-customizable" checked={form.customizable} onChange={e => setForm(f => ({ ...f, customizable: e.target.checked }))} className="w-4 h-4 accent-[#0d9488]" />
            <label htmlFor="pkg-customizable" className="text-sm text-slate-600">Customizable</label>
            <input type="checkbox" id="pkg-active" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="w-4 h-4 accent-[#0d9488] ml-4" />
            <label htmlFor="pkg-active" className="text-sm text-slate-600">Active</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)}
              className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-[#0d9488] hover:bg-[#0a7a70] disabled:opacity-60 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
              {saving ? 'Saving…' : form.id ? 'Save Changes' : 'Create Package'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
