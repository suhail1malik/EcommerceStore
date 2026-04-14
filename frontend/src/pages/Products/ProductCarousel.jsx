import React from "react";
import { Link } from "react-router-dom";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import Tilt from "react-parallax-tilt";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaStar } from "react-icons/fa";
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="mb-4">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Slider {...settings} className="w-full pb-8">
          {products.map((product) => (
            <div key={product._id} className="p-2 sm:p-4 outline-none">
              <div className="relative w-full overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-zinc-950 dark:via-black dark:to-zinc-950 border border-slate-200 dark:border-white/5 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.1)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] transition-all duration-500">
                <div className="flex flex-col lg:flex-row items-center p-6 lg:p-16 gap-8 lg:gap-16">
                  
                  {/* Typography Content (Left Side) */}
                  <div className="flex-1 w-full flex flex-col justify-center space-y-6 lg:pl-8 z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit backdrop-blur-sm">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#d97706]"></span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold tracking-widest uppercase text-xs">Premium Collection</span>
                    </div>
                    
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white font-serif leading-tight tracking-tight">
                      {product.name}
                    </h1>
                    
                    <p className="text-slate-600 dark:text-gray-400 text-base sm:text-lg leading-relaxed max-w-xl font-light">
                      {product.description.substring(0, 160)}...
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-6 pt-2">
                      <span className="text-3xl lg:text-5xl font-bold font-serif text-slate-900 dark:text-white drop-shadow-sm dark:drop-shadow-lg">
                        ₹{product.price?.toLocaleString("en-IN")}
                      </span>
                      <Link
                        to={`/product/${product._id}`}
                        className="px-8 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-black font-extrabold tracking-wide uppercase text-sm rounded-xl hover:bg-emerald-500 dark:hover:bg-emerald-500 hover:text-white dark:hover:text-white transition-all duration-300 shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] active:scale-95"
                      >
                        Explore Now
                      </Link>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-8 pt-6 border-t border-gray-200 dark:border-slate-800/80 mt-4">
                      <div className="flex flex-col">
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Brand</span>
                        <span className="text-slate-800 dark:text-white font-medium">{product.brand}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Reviews</span>
                        <span className="text-yellow-400 font-medium flex items-center gap-1.5">
                          <FaStar /> {product.numReviews}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Stock</span>
                        <span className="text-emerald-400 font-medium flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          {product.countInStock} Left
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 3D Tilted Image (Right Side) */}
                  <div className="flex-1 w-full flex justify-center lg:justify-end z-10 w-full max-w-md mx-auto lg:max-w-none perspective-[2000px]">
                    <Tilt
                      tiltMaxAngleX={12}
                      tiltMaxAngleY={12}
                      perspective={1500}
                      scale={1.05}
                      transitionSpeed={2000}
                      glareEnable={true}
                      glareMaxOpacity={0.3}
                      glarePosition="all"
                      className="w-full sm:max-w-sm lg:max-w-md aspect-[4/5] rounded-[2rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border border-white/10"
                    >
                      <img
                        src={`${BASE_URL}${product.image}`}
                        alt={product.name}
                        className="w-full h-full object-cover transform scale-[1.02]"
                      />
                    </Tilt>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;
