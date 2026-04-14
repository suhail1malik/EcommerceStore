import React from 'react';
const Modal = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 p-6 rounded-2xl z-10 text-left border border-slate-200 dark:border-slate-700 shadow-2xl">
            <button
              className="absolute top-4 right-4 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 focus:outline-none transition-colors"
              onClick={onClose}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="pt-2">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;