'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function ImageCarousel({ images }) {
  if (!images || images.length === 0) return null;

  // sort by displayOrder
  const sortedImages = [...images].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-[#0f2744] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
        Gallery
      </h2>
      <div className="relative mx-auto" style={{ maxWidth: '100%' }}>
        <style dangerouslySetInnerHTML={{__html: `
          .swiper {
            border-radius: 12px;
            overflow: visible !important;
          }
          .swiper-slide img {
            border-radius: 12px;
            object-fit: cover;
          }
          .swiper-button-next, .swiper-button-prev {
            width: 36px !important;
            height: 36px !important;
            background: white !important;
            border-radius: 50% !important;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15) !important;
            color: #1a1a1a !important;
            margin-top: -18px !important;
          }
          .swiper-button-next::after, .swiper-button-prev::after {
            font-size: 14px !important;
          }
          .swiper-button-prev { left: -14px !important; }
          .swiper-button-next { right: -14px !important; }
          
          @media (max-width: 639px) {
            .swiper-button-prev { left: 8px !important; }
            .swiper-button-next { right: 8px !important; }
          }

          .swiper-pagination-bullet {
            width: 8px !important;
            height: 8px !important;
            border-radius: 50% !important;
            background: #d1d5db !important;
            opacity: 1 !important;
            transition: width 0.2s ease !important;
            margin: 0 4px !important;
          }
          .swiper-pagination-bullet-active {
            width: 22px !important;
            border-radius: 4px !important;
            background: #0d9488 !important;
          }
        `}} />
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          loop={sortedImages.length > 1}
          className="w-full h-[350px] md:h-[500px]"
        >
          {sortedImages.map((img) => (
            <SwiperSlide key={img.id}>
              <img 
                src={img.imageUrl || img.image_url} 
                alt="Gallery" 
                className="w-full h-full" 
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
