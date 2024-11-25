import React from 'react';

interface LogoProps {
  url: string;
  alt: string;
}

export function Logo({ url, alt }: LogoProps) {
  return (
    <div className="flex items-center h-12">
      <img 
        src={url} 
        alt={alt}
        className="h-full w-auto object-contain"
      />
    </div>
  );
}