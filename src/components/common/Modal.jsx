import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export const Modal = ({ isOpen, onClose, children, title }) => {
  const modalRef = useRef(null);

  // Close modal when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);


  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-neutral-800 rounded-lg shadow-lg max-w-lg w-full p-6 relative flex flex-col max-h-[90vh]"
      >
        <div className="flex justify-between items-center pb-4 border-b border-neutral-700">
          <h2 className="text-xl font-semibold text-neutral-100">{title}</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-200 text-2xl"
          >
            &times;
          </button>
        </div>
        <div className="mt-4 overflow-y-auto flex-grow custom-scrollbar">
          {children}
        </div>
      </div>
    </div>,
    document.body // Portal to body to avoid z-index issues
  );
};