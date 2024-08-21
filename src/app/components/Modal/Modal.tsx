import React, { ReactNode, useEffect } from 'react';
import './Modal.css';
import Image from 'next/image';

interface ModalProps {
    isOpen: boolean,
    onClose: () => void,
    children: ReactNode
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isOpen]);

    // Handle close on Escape key press
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-wrapper">
                <div className="modal">
                    <button type="button" className="modal-close-button" onClick={onClose}>
                        <Image
                            src={'/assets/icons/close.svg'}
                            alt="Close"
                            width={35}
                            height={35}
                            priority
                        />
                    </button>
                    <div className='modal-inner-warper'>
                        <div className='modal-content'>
                        {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
