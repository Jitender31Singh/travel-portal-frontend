'use client';
import { useState, useEffect } from 'react';
import { Plus, CalendarDays, Trash2, Pencil } from 'lucide-react';
import { getPackagesApi, getTreksApi, getItineraryApi, createItinerary, updateItinerary, deleteItinerary } from '@/lib/api';
import { TextField, TextArea, NumberField, SelectField, ArrayField } from '@/components/admin/Fields';
import Modal from '@/components/admin/Modal';
import { PageHeader, Badge, LoadingSpinner, ErrorState, EmptyState } from '@/components/admin/Common';
import { toast } from '@/components/admin/Toast';

const REF_TYPES = [
  { value: '0', label: 'Package' },
  { value: '1', label: 'Trek' },
];

const EMPTY = {
  referenceId: '', referenceType: '0', dayNumber: '', title: '', description: '', activities: [],
  stay: '', meals: '', travelMode: '', distanceCovered: '', altitude: '', active: true,
};

export default function AdminItinerary() {
  const [references, setReferences] = useState({ packages: [], treks: [] });
  const [viewRefType, setViewRefType] = useState('0');
  const [viewRefId, setViewRefId] = useState('');
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingItin, setLoadingItin] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [p, t] = await Promise.all([getPackagesApi(), getTreksApi()]);
        setReferences({
          packages: Array.isArray(p) ? p : [],
          treks: Array.isArray(t) ? t : [],
        });
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!viewRefId) { setItinerary([]); return; }
    setLoadingItin(true);
    getItineraryApi(viewRefId, Number(viewRefType))
      .then(data => setItinerary(Array.isArray(data) ? data : []))
      .catch(() => setItinerary([]))
      .finally(() => setLoadingItin(false));
  }, [viewRefId, viewRefType]);

  function getRefOptions(type) {
    if (String(type) === '1') return references.treks.map(t => ({ value: t.id, label: t.title }));
    return references.packages.map(p => ({ value: p.id, label: p.title }));
  }

  function openCreate() {
    setEditing(null);
    setForm({
      ...EMPTY,
      referenceType: viewRefType || '0',
      referenceId: viewRefId || '',
    });
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditing(item);
    setForm({
      referenceId: item.referenceId || item.packageId || item.package_id || viewRefId || '',
      referenceType: String(item.referenceType !== undefined ? item.referenceType : (viewRefType || '0')),
      dayNumber: item.dayNumber ?? item.day_number ?? '',
      title: item.title || '',
      description: item.description || '',
      activities: Array.isArray(item.activities) ? item.activities : [],
      stay: item.stay || '',
      meals: item.meals || '',
      travelMode: item.travelMode || item.travel_mode || '',
      distanceCovered: item.distanceCovered || item.distance_covered || '',
      altitude: item.altitude || item.max_altitude || '',
      active: item.active !== false,
      createdAt: item.createdAt || item.created_at || null,
    });
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        referenceId: form.referenceId || viewRefId,
        referenceType: form.referenceType !== undefined && form.referenceType !== '' ? Number(form.referenceType) : Number(viewRefType || 0),
        dayNumber: form.dayNumber ? Number(form.dayNumber) : null,
        title: form.title,
        description: form.description,
        activities: Array.isArray(form.activities) ? form.activities : [],
        stay: form.stay || null,
        meals: form.meals || null,
        travelMode: form.travelMode || null,
        distanceCovered: form.distanceCovered || null,
        altitude: form.altitude || null,
        active: form.active,
        createdAt: form.createdAt || (editing ? editing.createdAt : new Date().toISOString()),
        packageId: form.referenceId || viewRefId,
      };
      if (editing) {
        await updateItinerary(editing.id, payload);
        toast('Itinerary day updated successfully');
      } else {
        await createItinerary(payload);
        toast('Itinerary day added successfully');
      }
      setModalOpen(false);
      if (viewRefId) {
        const data = await getItineraryApi(viewRefId, Number(viewRefType));
        setItinerary(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      toast(editing ? 'Failed to update itinerary' : 'Failed to add itinerary', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteItinerary(deleteId);
      toast('Itinerary day deleted');
      setDeleteId(null);
      if (viewRefId) {
        const data = await getItineraryApi(viewRefId, Number(viewRefType));
        setItinerary(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      toast('Failed to delete itinerary day', 'error');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Itinerary Management"
        subtitle="Add and view day-by-day itinerary for packages and treks"
        action={
          <button onClick={openCreate} disabled={!viewRefId}
            className="flex items-center gap-2 bg-[#0d9488] hover:bg-[#0a7a70] disabled:opacity-50 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors">
            <Plus size={16} /> Add Day
          </button>
        }
      />

      {/* Reference selector */}
      <div className="mb-6 grid sm:grid-cols-2 gap-4 max-w-lg">
        <SelectField label="Reference Type" value={viewRefType} onChange={v => { setViewRefType(v); setViewRefId(''); }} options={REF_TYPES} />
        <SelectField label={viewRefType === '0' ? "Select Package" : "Select Trek"} value={viewRefId} onChange={setViewRefId}
          options={getRefOptions(viewRefType)} placeholder={`Choose a ${viewRefType === '0' ? 'package' : 'trek'}…`} />
      </div>

      {loading ? <LoadingSpinner /> : !viewRefId ? (
        <EmptyState icon={CalendarDays} message={`Select a ${viewRefType === '0' ? 'package' : 'trek'} to view its itinerary.`} />
      ) : loadingItin ? <LoadingSpinner /> : itinerary.length === 0 ? (
        <EmptyState icon={CalendarDays} message="No itinerary days yet. Click 'Add Day' to create one." />
      ) : (
        <div className="space-y-4">
          {itinerary
            .slice()
            .sort((a, b) => (a.dayNumber || 0) - (b.dayNumber || 0))
            .map(item => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-100 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#0d9488] text-white flex items-center justify-center font-bold text-lg">
                    {item.dayNumber}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-[#0f2744] text-sm">{item.title}</h3>
                      <div className="flex items-center gap-1.5">
                        <Badge color={item.active ? 'green' : 'gray'}>{item.active ? 'Active' : 'Inactive'}</Badge>
                        <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-teal-50 text-slate-400 hover:text-[#0d9488] transition-colors" title="Edit">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    {item.description && <p className="text-sm text-slate-500 mb-3">{item.description}</p>}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs mt-1">
                      {item.stay && <div><span className="text-slate-400">Stay:</span> <span className="text-slate-600 font-medium">{item.stay}</span></div>}
                      {item.meals && <div><span className="text-slate-400">Meals:</span> <span className="text-slate-600 font-medium">{item.meals}</span></div>}
                      {(item.travelMode || item.travel_mode) && <div><span className="text-slate-400">Travel:</span> <span className="text-slate-600 font-medium">{item.travelMode || item.travel_mode}</span></div>}
                      {(item.distanceCovered || item.distance_covered) && <div><span className="text-slate-400">Distance:</span> <span className="text-slate-600 font-medium">{item.distanceCovered || item.distance_covered}</span></div>}
                      {(item.altitude || item.max_altitude) && <div><span className="text-slate-400">Altitude:</span> <span className="text-slate-600 font-medium">{item.altitude || item.max_altitude}</span></div>}
                    </div>
                    {item.activities?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {item.activities.map((a, i) => (
                          <span key={i} className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">{a}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Itinerary Day" : "Add Itinerary Day"} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <SelectField label="Reference Type" value={form.referenceType} onChange={v => setForm(f => ({ ...f, referenceType: v, referenceId: '' }))} options={REF_TYPES} required />
            <SelectField label="Parent Item" value={form.referenceId} onChange={v => setForm(f => ({ ...f, referenceId: v }))}
              options={getRefOptions(form.referenceType)} placeholder="Select item" required />
            <NumberField label="Day Number" value={form.dayNumber} onChange={v => setForm(f => ({ ...f, dayNumber: v }))} required />
          </div>
          <TextField label="Title" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} required placeholder="e.g. Arrival in Manali" />
          <TextArea label="Description" value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} rows={3} />
          <div className="grid grid-cols-2 gap-4">
            <TextField label="Stay" value={form.stay} onChange={v => setForm(f => ({ ...f, stay: v }))} placeholder="e.g. Hotel in Manali" />
            <TextField label="Meals" value={form.meals} onChange={v => setForm(f => ({ ...f, meals: v }))} placeholder="e.g. Breakfast & Dinner" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <TextField label="Travel Mode" value={form.travelMode} onChange={v => setForm(f => ({ ...f, travelMode: v }))} placeholder="e.g. Drive" />
            <TextField label="Distance Covered" value={form.distanceCovered} onChange={v => setForm(f => ({ ...f, distanceCovered: v }))} placeholder="e.g. 50 km" />
            <TextField label="Altitude" value={form.altitude} onChange={v => setForm(f => ({ ...f, altitude: v }))} placeholder="e.g. 6,700 ft" />
          </div>
          <ArrayField label="Activities" value={form.activities} onChange={v => setForm(f => ({ ...f, activities: v }))} placeholder="e.g. Sightseeing" />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="itin-active" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="w-4 h-4 accent-[#0d9488]" />
            <label htmlFor="itin-active" className="text-sm text-slate-600">Active</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)}
              className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-[#0d9488] hover:bg-[#0a7a70] disabled:opacity-60 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
              {saving ? 'Saving…' : editing ? 'Update Day' : 'Add Day'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Itinerary Day" size="md">
        <p className="text-sm text-slate-600 mb-5">Are you sure you want to delete this itinerary day?</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteId(null)}
            className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleDelete} disabled={deleting}
            className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
