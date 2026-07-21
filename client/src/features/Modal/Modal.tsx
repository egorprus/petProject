import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { IoCloseOutline } from 'react-icons/io5';
import './style.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ isOpen, onClose, children } : ModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <IoCloseOutline size={24} />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}