import React from 'react';

interface SheSTEMLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export const SheSTEMLogo: React.FC<SheSTEMLogoProps> = ({ 
  className = "", 
  width = 160, 
  height = 40 
}) => {
  return (
    <div className={`flex items-center ${className}`} style={{ width, height }}>
      {/* Molecule Icon - 1 central atom + 3 connected atoms */}
      <div className="flex-shrink-0 mr-3">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Central atom (larger, dark blue) */}
          <circle cx="16" cy="16" r="4" fill="#1E3A8A" />
          
          {/* Connected atoms (3 atoms around the central one) */}
          <circle cx="16" cy="6" r="3" fill="#8B5CF6" />   {/* Top atom */}
          <circle cx="6" cy="22" r="3" fill="#8B5CF6" />   {/* Bottom left atom */}
          <circle cx="26" cy="22" r="3" fill="#8B5CF6" />  {/* Bottom right atom */}
          
          {/* Molecular bonds (lines connecting atoms) */}
          <line x1="16" y1="12" x2="16" y2="9" stroke="#6B7280" strokeWidth="2" />        {/* Central to top */}
          <line x1="13" y1="18" x2="9" y2="21" stroke="#6B7280" strokeWidth="2" />        {/* Central to bottom left */}
          <line x1="19" y1="18" x2="23" y2="21" stroke="#6B7280" strokeWidth="2" />       {/* Central to bottom right */}
        </svg>
      </div>
      
      {/* Text Logo - matching uploaded image exactly */}
      <div className="flex items-baseline">
        <span className="text-3xl font-bold" style={{ color: '#8B5CF6' }}>
          She
        </span>
        <span className="text-3xl font-bold" style={{ color: '#1E3A8A' }}>
          STEM
        </span>
      </div>
    </div>
  );
};
