'use client';
import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, MapPin, Search } from 'lucide-react';
import {
  getDestinationsApi, createDestination, updateDestination, deleteDestination
} from '@/lib/api';
import { TextField, TextArea, RichTextField, ImageUploadField } from '@/components/admin/Fields';
import Modal from '@/components/admin/Modal';
import { PageHeader, Badge, LoadingSpinner, ErrorState, EmptyState } from '@/components/admin/Common';
import { toast } from '@/components/admin/Toast';
import { generateSlug } from '@/lib/utils';

const EMPTY = { name: '', slug: '', shortDescription: '', description: '', heroImage: '' };

export default function AdminDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await getDestinationsApi();
      setDestinations(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load destinations.');
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm(EMPTY);
    setModalOpen(true);
  }

  function openEdit(dest) {
    setEditing(dest);
    setForm({
      name: dest.name || '',
      slug: dest.slug || '',
      shortDescription: dest.shortDescription || '',
      description: dest.description || '',
      heroImage: dest.heroImage || '',
    });
    setModalOpen(true);
  }

  function handleNameChange(val) {
    setForm(f => ({
      ...f,
      name: val,
      slug: !editing || !f.slug || f.slug === generateSlug(f.name) ? generateSlug(val) : f.slug,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await updateDestination(editing.id, { ...form, id: editing.id, active: editing.active, createdAt: editing.createdAt });
        toast('Destination updated successfully');
      } else {
        await createDestination(form);
        toast('Destination created successfully');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast('Failed to save destination', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteDestination(deleteId);
      toast('Destination deleted');
      setDeleteId(null);
      load();
    } catch (err) {
      toast('Failed to delete destination', 'error');
    } finally {
      setDeleting(false);
    }
  }

  const filtered = destinations.filter(d =>
    !search || d.name?.toLowerCase().includes(search.toLowerCase()) || d.slug?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Destinations"
        subtitle={`${destinations.length} destination${destinations.length !== 1 ? 's' : ''} total`}
        action={
          <button onClick={openCreate} className="flex items-center gap-2 bg-[#0d9488] hover:bg-[#0a7a70] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors">
            <Plus size={16} /> Add Destination
          </button>
        }
      />

      <div className="mb-5 relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search destinations…"
          className="w-full border border-slate-200 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]" />
      </div>

      {loading ? <LoadingSpinner /> : error ? <ErrorState message={error} /> : filtered.length === 0 ? (
        <EmptyState icon={MapPin} message="No destinations found. Click 'Add Destination' to create one." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Name</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Slug</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Short Description</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {d.heroImage ? (
                        <img src={d.heroImage} alt={d.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <MapPin size={16} className="text-slate-400" />
                        </div>
                      )}
                      <span className="font-medium text-[#0f2744] text-sm">{d.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-500 font-mono">{d.slug}</td>
                  <td className="px-5 py-4 text-sm text-slate-500 hidden md:table-cell max-w-xs truncate">{d.shortDescription}</td>
                  <td className="px-5 py-4">
                    <Badge color={d.active ? 'green' : 'gray'}>{d.active ? 'Active' : 'Inactive'}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(d)} className="p-2 rounded-lg hover:bg-teal-50 text-slate-400 hover:text-[#0d9488] transition-colors">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => setDeleteId(d.id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Destination' : 'Add Destination'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <TextField label="Name" value={form.name} onChange={handleNameChange} required placeholder="e.g. Manali" />
            <TextField label="Slug" value={form.slug} onChange={v => setForm(f => ({ ...f, slug: v }))} required placeholder="e.g. manali" />
          </div>
          <TextField label="Short Description" value={form.shortDescription} onChange={v => setForm(f => ({ ...f, shortDescription: v }))} placeholder="Brief tagline" />
          <div className="col-span-full mb-4">
            <RichTextField label="Description" value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} />
          </div>
          <ImageUploadField label="Hero Image URL" value={form.heroImage} onChange={v => setForm(f => ({ ...f, heroImage: v }))} />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)}
              className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-[#0d9488] hover:bg-[#0a7a70] disabled:opacity-60 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
              {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Destination" size="md">
        <p className="text-sm text-slate-600 mb-5">Are you sure you want to delete this destination? This action cannot be undone.</p>
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
