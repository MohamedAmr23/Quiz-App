"use client";

import React from "react";
import { Check, X } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 ">
     
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      
      <div className={`bg-white rounded-2xl shadow-xl w-full ${maxWidthClass} relative z-10 border border-gray-100 overflow-visible transform scale-100 transition-all duration-300`}>
        
      
        <div className="flex items-stretch justify-between border-b border-gray-200 h-16 shrink-0">
          <div className="flex-1 flex items-center px-8 text-lg font-bold text-gray-800">
            {title}
          </div>
          
    
          {onSubmit || formId ? (
            <button
              type={formId ? "submit" : "button"}
              form={formId}
              onClick={formId ? undefined : onSubmit}
              className="w-16 flex items-center justify-center border-l border-gray-200 hover:bg-gray-50 text-gray-800 transition-colors cursor-pointer"
              title="Save"
            >
              <Check className="w-6 h-6 stroke-[3]" />
            </button>
          ) : null}

         
          <button
            type="button"
            onClick={onClose}
            className="w-16 flex items-center justify-center border-l border-gray-200 hover:bg-gray-50 text-gray-800 transition-colors cursor-pointer"
            title="Cancel"
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

       
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
