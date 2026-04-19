import { useEffect } from 'react';
import { HiOutlineCheckCircle } from 'react-icons/hi2';
import './Toast.css';

export default function Toast({ message, isVisible, onClose }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="toast animate-slide-up">
      <HiOutlineCheckCircle className="toast__icon" />
      <span className="toast__message">{message}</span>
    </div>
  );
}
