'use client';

import React from 'react';

// Forwarding ref allows this component to be used in forms that need direct access to the input element
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow ${className}`}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;