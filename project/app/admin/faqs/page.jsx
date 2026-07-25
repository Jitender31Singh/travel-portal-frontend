'use client';
import { useState, useEffect } from 'react';
import { Plus, HelpCircle, Trash2, Search, Pencil } from 'lucide-react';
import { getFaqsApi, createFaq, updateFaq, deleteFaq, getPackagesApi, getTreksApi, getDestinationsApi } from '@/lib/api';
import { TextField, TextArea, NumberField, SelectField } from '@/components/admin/Fields';
import Modal from '@/components/admin/Modal';
import { PageHeader, Badge, LoadingSpinner, ErrorState, EmptyState } from '@/components/admin/Common';
import { toast } from '@/components/admin/Toast';

const REF_TYPES = [
  { value: '0', label: 'Package' },
  { value: '1', label: 'Trek' },
  { value: '2', label: 'Destination' },
];

const EMPTY = { referenceId: '', referenceType: '0', question: '', answer: '', displayOrder: '', active: true };

export default function AdminFaqs() {
  const [faqs, setFaqs] = useState([]);
  const [references, setReferences] = useState({ packages: [], treks: [], destinations: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [viewRefType, setViewRefType] = useState('0');
  const [viewRefId, setViewRefId] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [pkgs, trks, dests] = await Promise.all([
          getPackagesApi(), getTreksApi(), getDestinationsApi(),
        ]);
        setReferences({
          packages: Array.isArray(pkgs) ? pkgs : [],
          treks: Array.isArray(trks) ? trks : [],
          destinations: Array.isArray(dests) ? dests : [],
        });
        // Load FAQs for first available reference (packages)
        if (pkgs?.length > 0) {
          setViewRefId(pkgs[0].id);
          await loadFaqs(pkgs[0].id, 0);
        } else {
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function loadFaqs(referenceId, type) {
    setLoading(true);
    try {
      const data = await getFaqsApi(referenceId, type);
      setFaqs(Array.isArray(data) ? data : []);
    } catch (err) {
      setFaqs([]);
    } finally {
      setLoading(false);
    }
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

  function openEdit(faq) {
    setEditing(faq);
    setForm({
      referenceId: faq.referenceId || viewRefId || '',
      referenceType: String(refTypeNumber(faq.referenceType) ?? viewRefType ?? '0'),
      question: faq.question || '',
      answer: faq.answer || '',
      displayOrder: faq.displayOrder ?? '',
      active: faq.active !== false,
    });
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        referenceType: Number(form.referenceType),
        displayOrder: form.displayOrder ? Number(form.displayOrder) : 0,
      };
      if (editing) {
        await updateFaq(editing.id, payload);
        toast('FAQ updated successfully');
      } else {
        await createFaq(payload);
        toast('FAQ created successfully');
      }
      setModalOpen(false);
      // Automatically switch view to the reference that was just added to
      setViewRefType(String(form.referenceType));
      setViewRefId(form.referenceId);
      await loadFaqs(form.referenceId, Number(form.referenceType));
    } catch (err) {
      toast(editing ? 'Failed to update FAQ' : 'Failed to create FAQ', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteFaq(deleteId);
      toast('FAQ deleted');
      setDeleteId(null);
      // Reload current FAQs
      if (faqs.length > 0) {
        const first = faqs.find(f => f.id !== deleteId);
        if (first) {
          await loadFaqs(first.referenceId, refTypeNumber(first.referenceType));
        }
      }
    } catch (err) {
      toast('Failed to delete FAQ', 'error');
    } finally {
      setDeleting(false);
    }
  }

  function refTypeNumber(type) {
    if (typeof type === 'number') return type;
    if (type === 'PACKAGE') return 0;
    if (type === 'TREK') return 1;
    if (type === 'DESTINATION') return 2;
    return Number(type) || 0;
  }

  function getRefOptions(type) {
    const t = Number(type);
    if (t === 0) return references.packages.map(p => ({ value: p.id, label: p.title }));
    if (t === 1) return references.treks.map(t => ({ value: t.id, label: t.title }));
    if (t === 2) return references.destinations.map(d => ({ value: d.id, label: d.name }));
    return [];
  }

  const filtered = faqs.filter(f =>
    !search || f.question?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="FAQs"
        subtitle={`${faqs.length} FAQ${faqs.length !== 1 ? 's' : ''} for current selection`}
        action={
          <button onClick={openCreate} className="flex items-center gap-2 bg-[#0d9488] hover:bg-[#0a7a70] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors">
            <Plus size={16} /> Add FAQ
          </button>
        }
      />

      {/* Reference selector */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-[200px] max-w-xs">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Reference Type</label>
          <select value={viewRefType} onChange={e => {
              setViewRefType(e.target.value);
              setViewRefId('');
              setFaqs([]);
            }}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488] bg-white">
            {REF_TYPES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[200px] max-w-xs">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Reference Item</label>
          <select
            value={viewRefId}
            onChange={e => {
              setViewRefId(e.target.value);
              if (e.target.value) loadFaqs(e.target.value, Number(viewRefType));
              else setFaqs([]);
            }}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488] bg-white">
            <option value="">Select to view FAQs…</option>
            {getRefOptions(viewRefType).map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
      </div>

      <div className="mb-5 relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search FAQs…"
          className="w-full border border-slate-200 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]" />
      </div>

      {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
        <EmptyState icon={HelpCircle} message="No FAQs found. Select a reference item or add a new FAQ." />
      ) : (
        <div className="space-y-3">
          {filtered.map(faq => (
            <div key={faq.id} className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge color="navy">{faq.referenceType}</Badge>
                    <Badge color={faq.active ? 'green' : 'gray'}>{faq.active ? 'Active' : 'Inactive'}</Badge>
                    {faq.displayOrder != null && <span className="text-xs text-slate-400">Order: {faq.displayOrder}</span>}
                  </div>
                  <h3 className="font-semibold text-[#0f2744] text-sm mb-1">{faq.question}</h3>
                  <p className="text-sm text-slate-500">{faq.answer}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(faq)} className="p-2 rounded-lg hover:bg-teal-50 text-slate-400 hover:text-[#0d9488] transition-colors" title="Edit">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => setDeleteId(faq.id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit FAQ" : "Add FAQ"} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Reference Type" value={form.referenceType} onChange={v => setForm(f => ({ ...f, referenceType: v }))} options={REF_TYPES} />
            <SelectField label="Reference Item" value={form.referenceId} onChange={v => setForm(f => ({ ...f, referenceId: v }))}
              options={getRefOptions(form.referenceType)} placeholder="Select item" required />
          </div>
          <TextField label="Question" value={form.question} onChange={v => setForm(f => ({ ...f, question: v }))} required placeholder="e.g. What is the cancellation policy?" />
          <TextArea label="Answer" value={form.answer} onChange={v => setForm(f => ({ ...f, answer: v }))} required rows={4} placeholder="Detailed answer" />
          <div className="grid grid-cols-2 gap-4">
            <NumberField label="Display Order" value={form.displayOrder} onChange={v => setForm(f => ({ ...f, displayOrder: v }))} placeholder="0" />
            <div className="flex items-end pb-2">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="faq-active" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="w-4 h-4 accent-[#0d9488]" />
                <label htmlFor="faq-active" className="text-sm text-slate-600">Active</label>
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)}
              className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-[#0d9488] hover:bg-[#0a7a70] disabled:opacity-60 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
              {saving ? 'Saving…' : editing ? 'Update FAQ' : 'Create FAQ'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete FAQ" size="md">
        <p className="text-sm text-slate-600 mb-5">Are you sure you want to delete this FAQ?</p>
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
