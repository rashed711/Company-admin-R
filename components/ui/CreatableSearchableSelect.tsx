import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../../services/localization';
import { ChevronDownIcon } from '../icons/Icons';

interface Option {
  value: string;
  label: string;
}

interface CreatableSearchableSelectProps {
  options: Option[];
  value: string;
  displayValue?: string;
  onChange: (value: string) => void;
  onCreate: (label: string) => void;
  placeholder?: string;
}

const CreatableSearchableSelect: React.FC<CreatableSearchableSelectProps> = ({
  options,
  value,
  displayValue,
  onChange,
  onCreate,
  placeholder,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);
  const currentDisplay = displayValue || selectedOption?.label || placeholder;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
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

  const canCreate = searchTerm && !options.some(opt => opt.label.toLowerCase() === searchTerm.toLowerCase());

  const handleSelect = (option: Option) => {
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm('');
  };
  
  const handleCreate = () => {
      onCreate(searchTerm);
      setIsOpen(false);
      setSearchTerm('');
  }

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setSearchTerm('');
    }
  };

  return (
    <div className="relative" ref={selectRef}>
      <button
        type="button"
        className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-primary))] text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 flex justify-between items-center text-start"
        onClick={toggleOpen}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={currentDisplay !== placeholder ? 'text-[rgb(var(--color-text-primary))]' : 'text-[rgb(var(--color-text-secondary))]'}>
          {currentDisplay}
        </span>
        <ChevronDownIcon className={`transform transition-transform w-4 h-4 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-[rgb(var(--color-surface))] rounded-md shadow-lg border border-[rgb(var(--color-border))] max-h-60 overflow-y-auto">
          <div className="p-2">
            <input
              type="text"
              placeholder={`${t('search')}...`}
              className="bg-[rgb(var(--color-muted))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-primary))] text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <ul role="listbox">
            {canCreate && (
                 <li
                    className="px-4 py-2 text-sm text-sky-600 font-semibold hover:bg-[rgb(var(--color-muted))] cursor-pointer"
                    onClick={handleCreate}
                 >
                    {t('create')} "{searchTerm}"
                </li>
            )}
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <li
                  key={option.value}
                  className={`px-4 py-2 text-sm text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text-primary))] cursor-pointer ${value === option.value ? 'bg-[rgba(var(--color-primary),0.1)] text-[rgb(var(--color-primary))]' : ''}`}
                  onClick={() => handleSelect(option)}
                  role="option"
                  aria-selected={value === option.value}
                >
                  {option.label}
                </li>
              ))
            ) : (
                !canCreate && <li className="px-4 py-2 text-sm text-center text-[rgb(var(--color-text-secondary))]">{t('no_results_found')}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CreatableSearchableSelect;
