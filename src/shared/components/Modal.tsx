"use client";

import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (e: React.FormEvent) => void;
  formId?: string;
  title: string;
  children: React.ReactNode;
  maxWidthClass?: string;
}

export default function Modal({
  isOpen,
  onClose,
  onSubmit,
  formId,
  title,
  children,
  maxWidthClass = "max-w-xl",
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className={`bg-white rounded-2xl shadow-xl w-full ${maxWidthClass} relative z-10 border border-gray-100 overflow-hidden transform scale-100 transition-all duration-300`}>
        
        {/* Header split row */}
        <div className="flex items-stretch justify-between border-b border-gray-200 h-16 shrink-0">
          <div className="flex-1 flex items-center px-8 text-lg font-bold text-gray-800">
            {title}
          </div>
          
          {/* Submit Checkmark Button */}
          {onSubmit || formId ? (
            <button
              type={formId ? "submit" : "button"}
              form={formId}
              onClick={formId ? undefined : onSubmit}
              className="w-16 flex items-center justify-center border-l border-gray-200 hover:bg-gray-50 text-gray-800 transition-colors cursor-pointer"
              title="Save"
            >
              <svg
                className="w-6 h-6 stroke-[3]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </button>
          ) : null}

          {/* Cancel Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-16 flex items-center justify-center border-l border-gray-200 hover:bg-gray-50 text-gray-800 transition-colors cursor-pointer"
            title="Cancel"
          >
            <svg
              className="w-6 h-6 stroke-[2.5]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Form or Content */}
        {formId ? (
          <form id={formId} onSubmit={onSubmit} className="p-8 space-y-6">
            {children}
          </form>
        ) : (
          <div className="p-8 space-y-6">{children}</div>
        )}
      </div>
    </div>
  );
}
