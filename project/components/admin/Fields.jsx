import { useState } from 'react';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadImage } from '@/lib/api';
import { toast } from '@/components/admin/Toast';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export function TextField({ label, value, onChange, placeholder, type = 'text', required, ...rest }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}{required && <span className="text-red-500"> *</span>}</label>
      <input
        type={type}
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
        {...rest}
      />
    </div>
  );
}

export function TextArea({ label, value, onChange, placeholder, rows = 3, required }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}{required && <span className="text-red-500"> *</span>}</label>
      <textarea
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent resize-none"
      />
    </div>
  );
}

export function RichTextField({ label, value, onChange, placeholder, required }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}{required && <span className="text-red-500"> *</span>}</label>
      <div className="bg-white rounded-lg overflow-hidden border border-slate-200">
        <ReactQuill 
          theme="snow" 
          value={value ?? ''} 
          onChange={onChange} 
          placeholder={placeholder}
          modules={{
            toolbar: [
              [{ 'header': [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              ['link'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              ['clean']
            ],
          }}
          className="rich-text-editor"
        />
      </div>
    </div>
  );
}

export function SelectField({ label, value, onChange, options, required, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}{required && <span className="text-red-500"> *</span>}</label>
      <select
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        required={required}
        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent bg-white"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => {
          const val = typeof opt === 'string' ? opt : opt.value;
          const lbl = typeof opt === 'string' ? opt : opt.label;
          return <option key={val} value={val}>{lbl}</option>;
        })}
      </select>
    </div>
  );
}

export function NumberField({ label, value, onChange, placeholder, required, step }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}{required && <span className="text-red-500"> *</span>}</label>
      <input
        type="number"
        step={step || '1'}
        value={value ?? ''}
        onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        placeholder={placeholder}
        required={required}
        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
      />
    </div>
  );
}

export function ArrayField({ label, value, onChange, placeholder }) {
  function update(idx, val) {
    const next = [...value];
    next[idx] = val;
    onChange(next);
  }
  function add() { onChange([...value, '']); }
  function remove(idx) { onChange(value.filter((_, i) => i !== idx)); }

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
      <div className="space-y-3">
        {value.map((item, i) => (
          <div key={i} className="flex gap-3">
            <input
              value={item}
              onChange={e => update(i, e.target.value)}
              placeholder={placeholder}
              className="flex-1 w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
            />
            <button type="button" onClick={() => remove(i)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors text-sm font-medium whitespace-nowrap flex-shrink-0">
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={add}
          className="inline-flex items-center text-sm text-[#0d9488] hover:text-[#0a7a70] font-semibold mt-1">
          + Add item
        </button>
      </div>
    </div>
  );
}

export function ImageUploadField({ label, value, onChange, required }) {
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const result = await uploadImage(null, file);
      onChange(result.url);
      toast('Image uploaded successfully');
    } catch (err) {
      toast('Failed to upload image', 'error');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}{required && <span className="text-red-500"> *</span>}</label>
      <div className="flex items-center gap-3">
        {value ? (
          <img src={value} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-slate-200 flex-shrink-0" />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0">
            <ImageIcon size={20} className="text-slate-400" />
          </div>
        )}
        <div className="flex-1 relative">
          <input
            type="text"
            value={value ?? ''}
            onChange={e => onChange(e.target.value)}
            placeholder="https://..."
            required={required}
            className="w-full border border-slate-200 rounded-lg pl-3 pr-28 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
          />
          <div className="absolute right-1 top-1 bottom-1">
            <label className="h-full px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium rounded-md flex items-center gap-1.5 cursor-pointer transition-colors">
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              <span>{uploading ? 'Uploading' : 'Upload'}</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={uploading} />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
