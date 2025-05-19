import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useNavigate } from "react-router-dom";

// Cambia esto por tus propias imágenes
const images = [
  "/images/image1.jpg",
  "/images/image2.jpg",
  "/images/image3.jpg",
];

export default function Gallery() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white px-4 relative">
      {/* Botón de volver */}
      <button onClick={() => navigate("/")} className="back-button">←</button>

      {/* Texto arriba del slider */}
      <p className="mb-6 text-center text-lg font-light">Recorre las fotos deslizando o con las flechas</p>

      <div className="relative w-full max-w-3xl">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={50}
          slidesPerView={1}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
        >
          {images.map((src, index) => (
            <SwiperSlide key={index}>
              <img src={src} alt={`book-${index}`} className="w-full rounded-lg" />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Flechas personalizadas fuera del área de imagen */}
        <div className="swiper-button-prev-custom absolute -left-12 top-1/2 transform -translate-y-1/2 z-20 text-yellow-500 text-4xl cursor-pointer select-none">
          ❮
        </div>
        <div className="swiper-button-next-custom absolute -right-12 top-1/2 transform -translate-y-1/2 z-20 text-yellow-500 text-4xl cursor-pointer select-none">
          ❯
        </div>
      </div>
    </div>
  );
}
