import React from 'react';

const Button = ({ children, onClick, type = 'button' }) => (
  <button
    className="w-full bg-color-7 text-color-13 font-bold py-3 rounded-lg hover:opacity-90 transition"
    onClick={onClick}
    type={type}
  >
    {children}
  </button>
);

export default Button;