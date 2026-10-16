import React, { useEffect } from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

const Toast = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === "success";

  return (
    <div
      className={`fixed top-20 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border backdrop-blur-xl animate-slideIn transition-all duration-300 ${
        isSuccess
          ? "bg-[#faedcd] border-[#7f5539]/30 text-[#7f5539] shadow-[#7f5539]/10"
          : "bg-rose-50/90 border-rose-200 text-rose-800 shadow-rose-500/10"
      }`}
    >
      {isSuccess ? (
        <CheckCircleIcon className="h-6 w-6 text-[#7f5539] flex-shrink-0" />
      ) : (
        <XCircleIcon className="h-6 w-6 text-rose-600 flex-shrink-0" />
      )}
      <span className="font-medium text-sm">{message}</span>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="ml-3 text-stone-400 hover:text-stone-600 transition-colors p-1 rounded-lg hover:bg-black/5"
      >
        ✕
      </button>

      <style jsx>{`
        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default Toast;