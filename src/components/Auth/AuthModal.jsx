import React from 'react';
import { FaTimes } from 'react-icons/fa';
import Login from './Login';

const AuthModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
        >
          <FaTimes className="text-xl" />
        </button>

        <Login onClose={onClose} />
      </div>
    </div>
  );
};

export default AuthModal;
