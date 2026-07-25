'use client';
import { useState, useEffect } from 'react';
import { Star, CheckCircle, Clock, Mail } from 'lucide-react';
import { getPendingReviews, approveReview, getAllReviewsApi } from '@/lib/api';
import { PageHeader, Badge, LoadingSpinner, ErrorState, EmptyState } from '@/components/admin/Common';
import { toast } from '@/components/admin/Toast';

export default function AdminReviews() {
  const [tab, setTab] = useState('pending');
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const [p, a] = await Promise.all([
        getPendingReviews().catch(() => []),
        getAllReviewsApi().catch(() => []),
      ]);
      setPending(Array.isArray(p) ? p : []);
      setApproved(Array.isArray(a) ? a : []);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id) {
    setApproving(id);
    try {
      await approveReview(id);
      toast('Review approved');
      await load();
    } catch (err) {
      toast('Failed to approve review', 'error');
    } finally {
      setApproving(null);
    }
  }

  const current = tab === 'pending' ? pending : approved;

  return (
    <div>
      <PageHeader title="Reviews" subtitle="Approve pending reviews or view all published reviews" />

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-100 rounded-xl p-1 w-fit">
        <button onClick={() => setTab('pending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === 'pending' ? 'bg-white text-[#0f2744] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <Clock size={15} /> Pending
          {pending.length > 0 && <Badge color="red">{pending.length}</Badge>}
        </button>
        <button onClick={() => setTab('approved')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === 'approved' ? 'bg-white text-[#0f2744] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <CheckCircle size={15} /> Approved
          {approved.length > 0 && <Badge color="green">{approved.length}</Badge>}
        </button>
      </div>

      {loading ? <LoadingSpinner /> : current.length === 0 ? (
        <EmptyState icon={Star} message={tab === 'pending' ? 'No pending reviews. All caught up!' : 'No approved reviews yet.'} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {current.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[#0f2744] text-sm">{r.userName}</h3>
                    {tab === 'pending' && <Badge color="gold">Pending</Badge>}
                  </div>
                  {r.email && (
                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                      <Mail size={11} /> {r.email}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={14} className={i <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-3">{r.comment}</p>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Ref: {r.referenceType}</span>
                {r.createdAt && <span>{new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
              </div>
              {tab === 'pending' && (
                <button onClick={() => handleApprove(r.id)} disabled={approving === r.id}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
                  <CheckCircle size={16} /> {approving === r.id ? 'Approving…' : 'Approve Review'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
