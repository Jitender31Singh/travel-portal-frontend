import StarRating from './StarRating';

export default function ReviewCard({ review }) {
  const initial = (review.user_name || 'A')[0].toUpperCase();
  const colors = ['bg-teal-600', 'bg-[#0f2744]', 'bg-amber-600', 'bg-emerald-600', 'bg-rose-600'];
  const colorIdx = initial.charCodeAt(0) % colors.length;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-3 h-full">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full ${colors[colorIdx]} text-white flex items-center justify-center font-bold text-sm flex-shrink-0`}>
          {initial}
        </div>
        <div>
          <p className="font-semibold text-sm text-[#0f2744]">{review.userName}</p>
          <StarRating rating={review.rating} size={13} />
        </div>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed">&ldquo;{review.comment}&rdquo;</p>
    </div>
  );
}
