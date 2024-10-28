import React from 'react';
import info from '../assets/img/info.png';

const Modal = ({ message, onConfirm, onCancel, confirmText, cancelText }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-color-3 bg-opacity-50 z-50">
      <div className="bg-color-13 p-7 rounded-lg shadow-lg w-80 flex flex-col gap-4">
        <img src={info} alt="Info" className="w-9 h-9 self-center" />
        <p className="font-regular text-2xl text-center text-color-12">{message}</p>
        <div className="flex justify-around space-x-4">
          <button
            className="px-7 py-2 bg-color-4 rounded-lg"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className="px-9 py-2 bg-[#30BE71] text-white font-regular text-lg rounded-lg"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;