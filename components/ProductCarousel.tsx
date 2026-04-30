"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { ProductCard } from "./ProductCard";

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
    <div className="product-carousel-container relative pb-10">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={2}
        navigation
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

      <style jsx global>{`
        .product-carousel-container .swiper-button-next,
        .product-carousel-container .swiper-button-prev {
          color: #f59e0b;
          background: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .product-carousel-container .swiper-button-next:after,
        .product-carousel-container .swiper-button-prev:after {
          font-size: 18px;
          font-weight: bold;
        }
        .product-carousel-container .swiper-pagination-bullet-active {
          background: #f59e0b;
        }
      `}</style>
    </div>
  );
}
