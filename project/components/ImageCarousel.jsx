'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function ImageCarousel({ images }) {
  if (!images || images.length === 0) return null;

  // sort by displayOrder
  const sortedImages = [...images].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return (
    <div className="rounded-2xl overflow-hidden mb-12 relative group shadow-sm border border-slate-100 bg-white">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={sortedImages.length > 1}
        className="w-full h-[300px] md:h-[450px]"
      >
        {sortedImages.map((img) => (
          <SwiperSlide key={img.id}>
            <img src={img.imageUrl} alt="Gallery image" className="w-full h-full object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
