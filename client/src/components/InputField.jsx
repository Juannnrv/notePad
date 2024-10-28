import React from 'react';

const InputField = ({ label, type, placeholder, value, onChange, icon }) => (
  <div className="relative mb-4 w-full">
    <label className="block text-color-7 font-bold mb-1.5 text-sm">{label}</label>
    <input
      className="border border-color-12 rounded-lg px-4 py-2 w-full bg-color-3 text-color-11 focus:outline-none focus:ring-2 focus:ring-color-10 transition"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
    />
    {icon && <span className="absolute right-3 top-9 text-color-2">{icon}</span>}
  </div>
);

export default InputField;