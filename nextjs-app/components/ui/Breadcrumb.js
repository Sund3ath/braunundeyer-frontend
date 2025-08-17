'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="text-text-secondary" size={16} />
          )}
          {item.href ? (
            <Link 
              href={item.href} 
              className="text-text-secondary hover:text-accent transition-colors duration-200 font-body"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-primary font-body font-medium">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}