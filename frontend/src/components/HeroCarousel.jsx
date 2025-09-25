import React from "react";
import { Link } from "react-router-dom";
import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Message from "./Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const HeroCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    adaptiveHeight: false,
    centerMode: false,
    variableWidth: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (isLoading)
    return (
      <div className="h-48 sm:h-64 md:h-72 lg:h-80 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-2"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Loading products...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="h-48 sm:h-64 md:h-72 lg:h-80 flex items-center justify-center bg-red-50 dark:bg-red-900/20">
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      </div>
    );

  if (!products || products.length === 0)
    return (
      <div className="h-48 sm:h-64 md:h-72 lg:h-80 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-300">
          No products available
        </p>
      </div>
    );

  return (
    <div className="w-full overflow-hidden">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .hero-carousel-container .slick-slider {
            width: 100% !important;
            max-width: 100% !important;
          }
          .hero-carousel-container .slick-list {
            width: 100% !important;
            max-width: 100% !important;
            overflow: hidden !important;
          }
          .hero-carousel-container .slick-track {
            width: 100% !important;
            max-width: 100% !important;
            display: flex !important;
          }
          .hero-carousel-container .slick-slide {
            width: 100% !important;
            max-width: 100% !important;
            flex: 0 0 100% !important;
          }
          .hero-carousel-container .slick-slide > div {
            width: 100% !important;
            max-width: 100% !important;
          }
        `,
        }}
      />
      <div className="hero-carousel-container">
        <Slider {...settings}>
          {products.map((p) => (
            <div key={p._id}>
              <Link to={`/product/${p._id}`} className="block">
                <div className="w-full h-48 sm:h-64 md:h-72 lg:h-80 overflow-hidden">
                  <img
                    src={`${BASE_URL}${p.image}`}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x300/374151/9ca3af?text=No+Image";
                    }}
                  />
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default HeroCarousel;
