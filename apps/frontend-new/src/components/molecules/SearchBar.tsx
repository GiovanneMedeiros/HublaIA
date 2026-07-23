'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/atoms';
import { cn } from '@/lib/cn';

export interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  isLoading?: boolean;
}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      className,
      value,
      onChange,
      onClear,
      isLoading,
      ...props
    },
    ref
  ) => {
    const handleClear = () => {
      if (onClear) {
        onClear();
      }
    };

    return (
      <div className="relative">
        <Input
          ref={ref}
          type="text"
          placeholder="Pesquisar..."
          value={value}
          onChange={onChange}
          icon={<Search className="h-5 w-5" />}
          className={cn(
            'pr-10',
            className
          )}
          {...props}
        />
        {value && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-gray hover:text-neutral-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin">
              <Search className="h-4 w-4 text-primary-500" />
            </div>
          </div>
        )}
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';

export { SearchBar };
