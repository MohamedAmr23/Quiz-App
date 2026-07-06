import React from "react";

interface FormRowProps {
  label: string;
  children: React.ReactNode;
  minLabelWidth?: string;
}

export default function FormRow({
  label,
  children,
  minLabelWidth = "min-w-[140px]",
}: FormRowProps) {
  return (
    <div className="flex items-stretch border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all relative">
      <div className={`bg-[#feeae2] text-gray-800 font-semibold px-6 py-3.5 flex items-center justify-center border-r border-gray-200 text-sm select-none shrink-0 ${minLabelWidth}`}>
        {label}
      </div>
      {children}
    </div>
  );
}
