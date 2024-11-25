import React from 'react';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
}

export function NavLink({ href, children, isActive = false }: NavLinkProps) {
  return (
    <a 
      href={href}
      className={`relative px-4 py-2 text-lg font-medium transition-colors duration-200
        ${isActive 
          ? 'text-[#006297]' 
          : 'text-gray-600 hover:text-[#006297]'
        }
        group
      `}
    >
      {children}
      <span className={`absolute bottom-0 left-0 w-full h-0.5 transform origin-left transition-transform duration-300 ease-out
        ${isActive 
          ? 'bg-[#006297] scale-x-100' 
          : 'bg-[#BAD975] scale-x-0 group-hover:scale-x-100'
        }
      `} />
    </a>
  );
}