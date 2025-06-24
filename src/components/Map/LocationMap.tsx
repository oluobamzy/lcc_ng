import React from 'react';

interface LocationMapProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationMap: React.FC<LocationMapProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-4xl p-4 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#006297]">Directions to Our Church</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="h-[500px] w-full">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.0311835923518!2d4.559989074346486!3d7.458494112079099!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10389020e597e0e3%3A0x8e7424be3e74359c!2sGloria%20Rendezvous%20Hotel!5e0!3m2!1sen!2sus!4v1718908155431!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <div className="mt-4 text-center">
          <p className="text-gray-600 mb-2">Gloria Rendezvous Hotel</p>
          <p className="text-gray-600">QGR7+34M, Niyi Ibikunle Road, Dada Estate, Osogbo, Nigeria</p>
        </div>
        <div className="mt-4 flex justify-center">
          <a 
            href="https://www.google.com/maps/dir//Gloria+Rendezvous+Hotel+QGR7%2B34M,+Niyi+Ibikunle+Road,+Dada+Estate,+Osogbo,+Nigeria"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#006297] text-white px-6 py-2 rounded hover:bg-opacity-90 transition-colors"
          >
            Get Directions
          </a>
        </div>
      </div>
    </div>
  );
};
