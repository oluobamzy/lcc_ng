import React from 'react';

interface CallToActionProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick?: () => void;
}

export function CallToAction({
  title,
  description,
  buttonText,
  onButtonClick,
}: CallToActionProps) {
  return (
    <div className="bg-[#006297] text-white rounded-lg p-8 text-center">
      <h2 className="text-3xl font-semibold mb-4">{title}</h2>
      <p className="text-xl mb-6">{description}</p>
      <button 
        onClick={onButtonClick}
        className="bg-[#BAD975] text-[#006297] px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
      >
        {buttonText}
      </button>
    </div>
  );
}