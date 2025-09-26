'use client';

import React, { useState, useRef, useEffect } from 'react';

interface SearchableSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  maxHeight?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Rechercher...",
  className = "",
  maxHeight = "200px"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Filtrer les options basé sur le terme de recherche
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [searchTerm, options]);

  // Fermer le dropdown quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Focus sur l'input de recherche quand on ouvre
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setSearchTerm('');
    }
  };

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Bouton de déclenchement */}
      <button
        type="button"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-left bg-white flex items-center justify-between"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {value || placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {/* Champ de recherche */}
          <div className="p-2 border-b border-gray-200">
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={placeholder}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Liste des options */}
          <div 
            className="overflow-y-auto"
            style={{ maxHeight }}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-blue-50 focus:bg-blue-50 focus:outline-none ${
                    option === value ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                  }`}
                >
                  {option}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                Aucun résultat trouvé
              </div>
            )}
          </div>

          {/* Indicateur de nombre de résultats */}
          {searchTerm && (
            <div className="px-3 py-2 text-xs text-gray-500 border-t border-gray-200">
              {filteredOptions.length} résultat{filteredOptions.length !== 1 ? 's' : ''} trouvé{filteredOptions.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
