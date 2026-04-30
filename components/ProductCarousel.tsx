"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { ProductCard } from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface ProductCarouselProps {
  products: any[];
  contactUrl?: string;
}

export function ProductCarousel({ products, contactUrl }: ProductCarouselProps) {
  return (
    <div className="product-carousel-container relative pb-10 group">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={2}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: {
            slidesPerView: 3,
          },
          768: {
            slidesPerView: 4,
          },
          1024: {
            slidesPerView: 5,
          },
        }}
        className="pb-12"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id} className="h-auto">
            <ProductCard product={product} contactUrl={contactUrl} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button className="swiper-button-prev-custom absolute left-2 top-1/2 -translate-y-[100%] z-[60] w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center text-neutral-400 hover:text-amber-600 hover:bg-amber-50 transition-all border border-neutral-100 disabled:hidden pointer-events-auto cursor-pointer">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button className="swiper-button-next-custom absolute right-2 top-1/2 -translate-y-[100%] z-[60] w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center text-neutral-400 hover:text-amber-600 hover:bg-amber-50 transition-all border border-neutral-100 disabled:hidden pointer-events-auto cursor-pointer">
        <ChevronRight className="w-6 h-6" />
      </button>

      <style jsx global>{`
        .product-carousel-container {
          padding: 0 40px;
          position: relative;
        }
        .product-carousel-container .swiper {
          padding-bottom: 50px !important;
          padding-top: 10px !important;
        }
        .swiper-button-prev-custom {
          left: 0 !important;
        }
        .swiper-button-next-custom {
          right: 0 !important;
        }
        .product-carousel-container .swiper-pagination {
          bottom: 0 !important;
        }
        .product-carousel-container .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          background: #d1d5db;
          opacity: 1;
          transition: all 0.3s ease;
        }
        .product-carousel-container .swiper-pagination-bullet-active {
          background: #f59e0b;
          width: 20px;
          border-radius: 4px;
        }
        
        @media (max-width: 768px) {
          .product-carousel-container {
            padding: 0;
          }
          .swiper-button-prev-custom,
          .swiper-button-next-custom {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
