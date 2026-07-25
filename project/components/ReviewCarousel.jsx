'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import ReviewCard from '@/components/ReviewCard';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function ReviewCarousel({ reviews }) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <div className="relative review-carousel -mx-2 px-2 pb-10">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true, dynamicBullets: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        spaceBetween={20}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="w-full h-full pb-12"
      >
        {reviews.map((r, i) => (
          <SwiperSlide key={r.id || i} className="h-auto">
            <div className="h-full">
              <ReviewCard review={r} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <style jsx global>{`
        .review-carousel .swiper-pagination-bullet {
          background: #0d9488;
        }
        .review-carousel .swiper-button-next,
        .review-carousel .swiper-button-prev {
          color: #0d9488;
          transform: scale(0.6);
        }
      `}</style>
    </div>
  );
}
