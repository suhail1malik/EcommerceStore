import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaCcVisa, FaCcMastercard, FaPaypal, FaArrowRight, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-20 pb-12 mt-auto relative overflow-hidden">
      {/* Aurora Accent */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-6">
              <Link 
                to="/"
                className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-1 hover:opacity-80 transition-all"
              >
                Commerce<span className="bg-gradient-to-r from-indigo-500 to-emerald-500 bg-clip-text text-transparent">Hub</span>
              </Link>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
                CommerceHub – A modern full-stack e-commerce platform. Discover curated collections, top-rated products, and a seamless shopping experience.
              </p>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-600 dark:text-slate-500 tracking-[0.2em] uppercase">Stay in the Circle</h3>
              <div className="relative max-w-sm group">
                <input 
                  type="email" 
                  placeholder="enter.your@email.com" 
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-500"
                />
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-xl transition-all">
                  <FaArrowRight size={14} />
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              {[
                { Icon: FaFacebook, link: "https://facebook.com/commercehub" },
                { Icon: FaTwitter, link: "https://twitter.com/commercehub" },
                { Icon: FaInstagram, link: "https://instagram.com/commercehub" }
              ].map(({ Icon, link }, i) => (
                <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-indigo-500 hover:border-indigo-500/50 transition-all duration-300">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Sections */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* Discovery */}
            <div className="space-y-6">
              <h3 className="text-xs font-black text-slate-600 dark:text-slate-500 tracking-[0.2em] uppercase">Discovery</h3>
              <ul className="space-y-4">
                {['All Collections', 'New Arrivals', 'Best Sellers', 'Exclusive Drop'].map(item => (
                  <li key={item}>
                    <Link to="/shop" className="text-sm font-semibold text-slate-700 dark:text-slate-400 hover:text-indigo-500 transition-colors flex items-center gap-2 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Assistance */}
            <div className="space-y-6">
              <h3 className="text-xs font-black text-slate-600 dark:text-slate-500 tracking-[0.2em] uppercase">Assistance</h3>
              <ul className="space-y-4">
                {['Contact Support', 'Order Tracking', 'Shipping Policy', 'Returns'].map(item => (
                  <li key={item}>
                    <Link to="/contact" className="text-sm font-semibold text-slate-700 dark:text-slate-400 hover:text-indigo-500 transition-colors flex items-center gap-2 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-6 col-span-2 md:col-span-1">
              <h3 className="text-xs font-black text-slate-600 dark:text-slate-500 tracking-[0.2em] uppercase">Company</h3>
              <ul className="space-y-4">
                {['About Us', 'Terms of Service', 'Privacy Policy', 'Store Locator'].map(item => (
                  <li key={item}>
                    <Link to="/terms" className="text-sm font-semibold text-slate-700 dark:text-slate-400 hover:text-indigo-500 transition-colors flex items-center gap-2 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 text-center md:text-left">
            &copy; {new Date().getFullYear()} CommerceHub. All Rights Reserved.
          </p>
          <div className="flex items-center gap-8 text-slate-400 dark:text-slate-600">
            <FaCcVisa size={32} className="grayscale hover:grayscale-0 transition-all cursor-pointer opacity-70 hover:opacity-100" />
            <FaCcMastercard size={32} className="grayscale hover:grayscale-0 transition-all cursor-pointer opacity-70 hover:opacity-100" />
            <FaPaypal size={32} className="grayscale hover:grayscale-0 transition-all cursor-pointer opacity-70 hover:opacity-100" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
