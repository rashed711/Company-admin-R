import React, { ReactNode } from 'react';
import { XIcon } from '../icons/Icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center backdrop-blur-sm"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="relative bg-[rgb(var(--color-surface))] rounded-xl shadow-2xl w-full max-w-lg m-4"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="flex items-start justify-between p-5 border-b rounded-t border-[rgb(var(--color-border))]">
          <h3 className="text-xl font-semibold text-[rgb(var(--color-text-primary))]" id="modal-title">
            {title}
          </h3>
          <button 
            type="button" 
            className="text-gray-400 bg-transparent hover:bg-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text-primary))] rounded-lg text-sm p-1.5 ms-auto inline-flex items-center"
            onClick={onClose}
            aria-label="Close"
          >
            <XIcon />
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        <div className="p-6 space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;