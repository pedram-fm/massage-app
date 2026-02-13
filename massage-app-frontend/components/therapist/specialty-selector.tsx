'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface SpecialtySelectorProps {
  value: string[];
  onChange: (specialties: string[]) => void;
  suggestions?: string[];
  maxItems?: number;
  className?: string;
}

const DEFAULT_SUGGESTIONS = [
  'ماساژ سوئدی',
  'ماساژ بافت عمیق',
  'ماساژ ورزشی',
  'آروماتراپی',
  'ماساژ سنگ داغ',
  'ماساژ تایلندی',
  'رفلکسولوژی',
  'شیاتسو',
  'ماساژ درمانی',
  'ماساژ آرامش‌بخش',
];

export function SpecialtySelector({
  value = [],
  onChange,
  suggestions = DEFAULT_SUGGESTIONS,
  maxItems = 10,
  className,
}: SpecialtySelectorProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      !value.includes(suggestion) &&
      suggestion.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleAdd = (specialty: string) => {
    if (!specialty.trim()) return;
    if (value.includes(specialty.trim())) return;
    if (value.length >= maxItems) {
      alert(`حداکثر ${maxItems} تخصص می‌توانید انتخاب کنید`);
      return;
    }

    onChange([...value, specialty.trim()]);
    setInputValue('');
    setShowSuggestions(false);
  };

  const handleRemove = (specialty: string) => {
    onChange(value.filter((s) => s !== specialty));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        handleAdd(inputValue);
      }
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      <Label>تخصص‌ها</Label>

      {/* Input with Suggestions */}
      <div className="relative">
        <Input
          type="text"
          placeholder="تخصص خود را اضافه کنید..."
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => {
            // Delay to allow click on suggestions
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          disabled={value.length >= maxItems}
        />

        {/* Suggestions Dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-10 mt-1 max-h-48 overflow-auto rounded-md border bg-white shadow-lg">
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="w-full px-3 py-2 text-right text-sm hover:bg-gray-100 transition-colors"
                onClick={() => handleAdd(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Specialties */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((specialty) => (
            <Badge
              key={specialty}
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1.5 text-sm"
            >
              <Check className="h-3 w-3 text-green-600" />
              <span>{specialty}</span>
              <button
                type="button"
                onClick={() => handleRemove(specialty)}
                className="ml-1 hover:text-red-600 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Helper Text */}
      <p className="text-xs text-gray-500">
        {value.length} از {maxItems} تخصص انتخاب شده
        {inputValue && ' • Enter برای افزودن'}
      </p>
    </div>
  );
}
