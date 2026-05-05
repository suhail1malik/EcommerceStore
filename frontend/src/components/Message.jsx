import React from "react";

const Message = ({ variant, children }) => {
  const getStyles = () => {
    switch (variant) {
      case "success":
        return {
          bg: "bg-emerald-500/10",
          text: "text-emerald-500",
          border: "border-emerald-500/20",
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )
        };
      case "error":
      case "danger":
        return {
          bg: "bg-rose-500/10",
          text: "text-rose-500",
          border: "border-rose-500/20",
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
      default:
        return {
          bg: "bg-blue-500/10",
          text: "text-blue-500",
          border: "border-blue-500/20",
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={`flex items-center gap-4 p-5 rounded-2xl border backdrop-blur-md shadow-sm transition-all animate-in fade-in slide-in-from-top-4 duration-500 ${styles.bg} ${styles.text} ${styles.border}`}>
      <div className="flex-shrink-0 opacity-80">
        {styles.icon}
      </div>
      <div className="text-sm font-bold tracking-tight uppercase tracking-[0.05em]">
        {children}
      </div>
    </div>
  );
};

export default Message;
