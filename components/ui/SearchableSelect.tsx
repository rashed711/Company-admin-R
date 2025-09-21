import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../../services/localization';
import { ChevronDownIcon } from '../icons/Icons';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ options, value, onChange, placeholder }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option: Option) => {
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm('');
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
        setSearchTerm('');
    }
  }

  return (
    <div className="relative" ref={selectRef}>
      <button
        type="button"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white flex justify-between items-center text-start"
        onClick={toggleOpen}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={selectedOption ? 'text-gray-900 dark:text-white' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDownIcon className={`transform transition-transform w-4 h-4 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border dark:border-gray-600 max-h-60 overflow-y-auto">
          <div className="p-2">
            <input
              type="text"
              placeholder={`${t('search')}...`}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <ul role="listbox">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <li
                  key={option.value}
                  className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleSelect(option)}
                  role="option"
                  aria-selected={value === option.value}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-sm text-center text-gray-500">{t('no_results_found')}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
