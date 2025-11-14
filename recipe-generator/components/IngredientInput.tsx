'use client';

import { useState, useRef, KeyboardEvent, ChangeEvent } from 'react';
import { X } from 'lucide-react';
import { allIngredients } from '@/lib/recipeUtils';

interface IngredientInputProps {
  ingredients: string[];
  onIngredientsChange: (ingredients: string[]) => void;
}

export default function IngredientInput({ ingredients, onIngredientsChange }: IngredientInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim().length > 0) {
      const filtered = allIngredients.filter(
        (ingredient) =>
          ingredient.toLowerCase().includes(value.toLowerCase()) &&
          !ingredients.includes(ingredient)
      );
      setSuggestions(filtered.slice(0, 8));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const addIngredient = (ingredient: string) => {
    const trimmed = ingredient.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      onIngredientsChange([...ingredients, trimmed]);
      setInputValue('');
      setSuggestions([]);
      setShowSuggestions(false);
      inputRef.current?.focus();
    }
  };

  const removeIngredient = (index: number) => {
    onIngredientsChange(ingredients.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (suggestions.length > 0 && showSuggestions) {
        addIngredient(suggestions[0]);
      } else {
        addIngredient(inputValue);
      }
    } else if (e.key === 'Backspace' && !inputValue && ingredients.length > 0) {
      removeIngredient(ingredients.length - 1);
    }
  };

  return (
    <div className="w-full">
      <div className="relative">
        <div className="flex flex-wrap gap-2 p-3 min-h-[56px] border-2 border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all bg-white">
          {ingredients.map((ingredient, index) => (
            <div
              key={index}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
            >
              <span>{ingredient}</span>
              <button
                onClick={() => removeIngredient(index)}
                className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                aria-label={`Remove ${ingredient}`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => inputValue && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={ingredients.length === 0 ? 'Type ingredients (e.g., chicken, tomato)...' : ''}
            className="flex-1 min-w-[200px] outline-none text-gray-800 placeholder-gray-400"
          />
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => addIngredient(suggestion)}
                className="w-full text-left px-4 py-2.5 hover:bg-blue-50 transition-colors text-gray-800 border-b last:border-b-0 border-gray-100"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {ingredients.length === 0 && (
        <p className="text-sm text-gray-500 mt-2">
          Start typing to see ingredient suggestions
        </p>
      )}
    </div>
  );
}
