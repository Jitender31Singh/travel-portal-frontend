'use client';
import { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Check, Link2 } from 'lucide-react';
import { uploadImage, saveImage, deleteImage, getPackagesApi, getTreksApi, getDestinationsApi } from '@/lib/api';
import { getGallery } from '@/lib/queries';
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

  // Gallery Management
  const [viewRefType, setViewRefType] = useState('0');
  const [viewParentId, setViewParentId] = useState('');
  const [galleryImages, setGalleryImages] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

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

  useEffect(() => {
    if (!viewParentId) { setGalleryImages([]); return; }
    setLoadingGallery(true);
    getGallery(viewParentId, Number(viewRefType))
      .then(data => setGalleryImages(data))
      .catch(() => toast('Failed to load gallery', 'error'))
      .finally(() => setLoadingGallery(false));
  }, [viewParentId, viewRefType]);

  async function handleDeleteImage(img) {
    if (!confirm('Are you sure you want to delete this image from both the database and Cloudinary?')) return;
    setDeletingId(img.id);
    try {
      // 1. Delete from backend DB
      await deleteImage(img.id);
      
      // 2. Extract public_id and delete from Cloudinary
      const url = img.imageUrl || img.image_url;
      if (url && url.includes('cloudinary.com')) {
        const uploadParts = url.split('/upload/');
        if (uploadParts.length > 1) {
          const withoutVersion = uploadParts[1].replace(/^v\d+\//, '');
          const publicId = withoutVersion.substring(0, withoutVersion.lastIndexOf('.')) || withoutVersion;
          
          await fetch('/api/cloudinary/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ publicId }),
          });
        }
      }
      toast('Image deleted successfully');
      setGalleryImages(prev => prev.filter(i => i.id !== img.id));
    } catch (error) {
      toast('Failed to delete image', 'error');
    } finally {
      setDeletingId(null);
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

      {/* Gallery Management Section */}
      <div className="mt-8 bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="text-lg font-bold text-[#0f2744] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Manage Uploaded Images</h2>
        <div className="grid sm:grid-cols-2 gap-4 max-w-lg mb-6">
          <SelectField label="Reference Type" value={viewRefType} onChange={v => { setViewRefType(v); setViewParentId(''); }} options={REF_TYPES} />
          <SelectField label="Parent Item" value={viewParentId} onChange={setViewParentId}
            options={getRefOptions(viewRefType)} placeholder="Select item to view images" />
        </div>

        {loadingGallery ? (
          <LoadingSpinner />
        ) : !viewParentId ? (
          <div className="text-center py-10 text-slate-500">Select an item above to view its images.</div>
        ) : galleryImages.length === 0 ? (
          <div className="text-center py-10 text-slate-500">No images found for this item.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {galleryImages.map(img => (
              <div key={img.id} className="relative group rounded-xl overflow-hidden border border-slate-200">
                <img src={img.imageUrl || img.image_url} alt="Gallery" className="w-full h-32 object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => handleDeleteImage(img)}
                    disabled={deletingId === img.id}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-50"
                  >
                    {deletingId === img.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
