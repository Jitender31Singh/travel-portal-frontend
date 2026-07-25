'use client';
import { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Check, Link2 } from 'lucide-react';
import { uploadImage, saveImage, getPackagesApi, getTreksApi, getDestinationsApi } from '@/lib/api';
import { TextField, NumberField, SelectField } from '@/components/admin/Fields';
import { PageHeader, LoadingSpinner } from '@/components/admin/Common';
import { toast } from '@/components/admin/Toast';

const REF_TYPES = [
  { value: '0', label: 'Package' },
  { value: '1', label: 'Trek' },
  { value: '2', label: 'Destination' },
];

export default function AdminImages() {
  const [references, setReferences] = useState({ packages: [], treks: [], destinations: [] });
  const [refsLoaded, setRefsLoaded] = useState(false);
  const [slug, setSlug] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');

  // Save form
  const [parentId, setParentId] = useState('');
  const [refType, setRefType] = useState('0');
  const [imageUrl, setImageUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState('');
  const [coverImage, setCoverImage] = useState(false);
  const [saving, setSaving] = useState(false);

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
      } finally {
        setRefsLoaded(true);
      }
    }
    load();
  }, []);

  function handleFileChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setUploadedUrl('');
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!file || !slug) {
      toast('Please provide a slug and select a file', 'error');
      return;
    }
    setUploading(true);
    try {
      const result = await uploadImage(slug, file);
      const url = typeof result === 'object' && result ? (result.url || result.imageUrl || Object.values(result)[0]) : result;
      setUploadedUrl(url || '');
      setImageUrl(url || '');
      toast('Image uploaded successfully');
    } catch (err) {
      toast('Failed to upload image', 'error');
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await saveImage({
        parentId,
        referenceType: Number(refType),
        imageUrl,
        displayOrder: displayOrder ? Number(displayOrder) : 0,
        coverImage,
      });
      toast('Image saved to gallery');
      setImageUrl('');
      setDisplayOrder('');
      setCoverImage(false);
    } catch (err) {
      toast('Failed to save image', 'error');
    } finally {
      setSaving(false);
    }
  }

  function getRefOptions(type) {
    const t = Number(type);
    if (t === 0) return references.packages.map(p => ({ value: p.id, label: p.title }));
    if (t === 1) return references.treks.map(t => ({ value: t.id, label: t.title }));
    if (t === 2) return references.destinations.map(d => ({ value: d.id, label: d.name }));
    return [];
  }

  return (
    <div>
      <PageHeader title="Image Management" subtitle="Upload images and assign them to packages, treks, or destinations" />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload section */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-[#0f2744] mb-4 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            <Upload size={18} className="text-[#0d9488]" /> Upload Image
          </h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <TextField label="Slug" value={slug} onChange={setSlug} required placeholder="e.g. manali-holiday" />
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Image File</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-[#0d9488] transition-colors cursor-pointer">
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="file-input" />
                <label htmlFor="file-input" className="cursor-pointer flex flex-col items-center gap-2">
                  {preview ? (
                    <img src={preview} alt="Preview" className="max-h-40 rounded-lg object-contain" />
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                        <ImageIcon size={24} className="text-slate-400" />
                      </div>
                      <p className="text-sm text-slate-500">Click to select an image</p>
                      <p className="text-xs text-slate-400">PNG, JPG up to 10MB</p>
                    </>
                  )}
                </label>
              </div>
            </div>
            <button type="submit" disabled={uploading || !file || !slug}
              className="w-full flex items-center justify-center gap-2 bg-[#0d9488] hover:bg-[#0a7a70] disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
              {uploading ? 'Uploading…' : <><Upload size={16} /> Upload</>}
            </button>
          </form>

          {uploadedUrl && (
            <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-100">
              <div className="flex items-center gap-2 text-sm text-green-700 font-medium mb-1">
                <Check size={16} /> Uploaded successfully
              </div>
              <div className="flex items-center gap-2">
                <input value={uploadedUrl} readOnly
                  className="flex-1 text-xs text-slate-500 bg-white border border-slate-200 rounded-lg px-3 py-2 font-mono" />
                <button onClick={() => { navigator.clipboard.writeText(uploadedUrl); toast('URL copied'); }}
                  className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:text-[#0d9488] hover:border-[#0d9488] transition-colors">
                  <Link2 size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Save to gallery section */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-[#0f2744] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Assign to Gallery</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <SelectField label="Reference Type" value={refType} onChange={v => { setRefType(v); setParentId(''); }} options={REF_TYPES} />
              <SelectField label="Parent Item" value={parentId} onChange={setParentId}
                options={getRefOptions(refType)} placeholder="Select item" required />
            </div>
            <TextField label="Image URL" value={imageUrl} onChange={setImageUrl} required placeholder="https://… (auto-filled after upload)" />
            <div className="grid grid-cols-2 gap-4">
              <NumberField label="Display Order" value={displayOrder} onChange={setDisplayOrder} placeholder="0" />
              <div className="flex items-end pb-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="cover-img" checked={coverImage} onChange={e => setCoverImage(e.target.checked)} className="w-4 h-4 accent-[#0d9488]" />
                  <label htmlFor="cover-img" className="text-sm text-slate-600">Set as cover image</label>
                </div>
              </div>
            </div>
            <button type="submit" disabled={saving || !imageUrl || !parentId}
              className="w-full bg-[#0d9488] hover:bg-[#0a7a70] disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
              {saving ? 'Saving…' : 'Save to Gallery'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
