import { useState } from 'react';
import { X, MessageCircle } from 'lucide-react';

const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210';
const WA_MESSAGE = import.meta.env.VITE_WHATSAPP_MESSAGE || 'Hello,%20I%20need%20a%20quotation%20for%20bulk%20hardware%20supply';

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  const waUrl = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

  if (dismissed) return null;

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end gap-2">
      {/* Tooltip bubble */}
      {showTooltip && (
        <div className="bg-white rounded-lg shadow-xl border border-gray-100 p-3 max-w-[220px] animate-fade-up relative">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-1.5 right-1.5 text-gray-400 hover:text-gray-600"
            aria-label="Close tooltip"
          >
            <X size={14} />
          </button>
          <p className="text-xs font-semibold text-navy-800 mb-1">💬 Quick Enquiry</p>
          <p className="text-xs text-gray-600 leading-relaxed">
            Chat with us on WhatsApp for instant quotes and bulk order pricing!
          </p>
        </div>
      )}

      {/* WhatsApp button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20c05c] text-white font-semibold
          rounded-full shadow-2xl transition-all duration-300 overflow-hidden
          ${hovered ? 'px-5 py-3.5' : 'w-14 h-14 justify-center'}
        `}
        aria-label="Chat on WhatsApp"
      >
        {/* WhatsApp SVG icon */}
        <svg viewBox="0 0 32 32" className="w-6 h-6 shrink-0 fill-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2C8.28 2 2 8.28 2 16c0 2.48.67 4.8 1.84 6.8L2 30l7.38-1.82A13.9 13.9 0 0 0 16 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.2a11.1 11.1 0 0 1-5.66-1.54l-.4-.24-4.38 1.08 1.1-4.28-.27-.44A11.14 11.14 0 0 1 4.8 16C4.8 9.8 9.8 4.8 16 4.8S27.2 9.8 27.2 16 22.2 27.2 16 27.2zm6.1-8.33c-.33-.17-1.97-.97-2.28-1.08-.3-.1-.52-.17-.74.17-.22.33-.85 1.08-1.04 1.3-.19.22-.38.24-.71.08-.33-.17-1.4-.52-2.66-1.65-.98-.88-1.64-1.96-1.84-2.3-.19-.33-.02-.5.15-.67.15-.15.33-.4.5-.6.17-.2.22-.33.33-.55.1-.22.05-.42-.03-.58-.08-.17-.74-1.78-1.01-2.44-.27-.64-.54-.55-.74-.56h-.63c-.22 0-.57.08-.87.4-.3.33-1.14 1.12-1.14 2.72s1.17 3.16 1.33 3.38c.17.22 2.3 3.5 5.57 4.9.78.34 1.39.54 1.86.69.78.25 1.49.21 2.05.13.63-.09 1.97-.81 2.24-1.59.28-.78.28-1.44.2-1.59-.1-.13-.3-.2-.63-.36z"/>
        </svg>
        {hovered && (
          <span className="text-sm whitespace-nowrap animate-fade-in">Chat with us</span>
        )}
      </a>
    </div>
  );
}
