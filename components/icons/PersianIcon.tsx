
import React from 'react';

const PersianIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    stroke="none"
    {...props}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.06 15.5l-3.54-3.54 1.41-1.41L10.94 15.08l5.65-5.65 1.41 1.41L10.94 17.5z"/>
  </svg>
);

export default PersianIcon;
