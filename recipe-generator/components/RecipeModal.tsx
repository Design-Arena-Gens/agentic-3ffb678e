'use client';

import { RecipeMatch } from '@/types/recipe';
import { X, Clock, ChefHat, Users } from 'lucide-react';
import { useEffect } from 'react';

interface RecipeModalProps {
  recipe: RecipeMatch | null;
  onClose: () => void;
}

export default function RecipeModal({ recipe, onClose }: RecipeModalProps) {
  useEffect(() => {
    if (recipe) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [recipe]);

  if (!recipe) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-700 bg-green-100';
      case 'medium':
        return 'text-yellow-700 bg-yellow-100';
      case 'hard':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const missingIngredients = recipe.ingredients.filter(
    (ing) => !recipe.matchedIngredients.some((matched) => ing.toLowerCase().includes(matched.toLowerCase()))
  );

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
          <div className="flex-1 pr-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{recipe.title}</h2>
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(recipe.difficulty)}`}>
                {recipe.difficulty}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-semibold text-purple-700 bg-purple-100">
                {recipe.cuisine}
              </span>
              {recipe.dietary.map((diet, idx) => (
                <span key={idx} className="px-3 py-1 rounded-full text-sm font-semibold text-blue-700 bg-blue-100">
                  {diet}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-2 text-gray-700">
              <Clock size={20} className="text-blue-600" />
              <span className="font-medium">{recipe.cookingTime} minutes</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Users size={20} className="text-blue-600" />
              <span className="font-medium">{recipe.servings} servings</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <ChefHat size={20} className="text-blue-600" />
              <span className="font-medium">{recipe.ingredients.length} ingredients</span>
            </div>
            <div className="ml-auto">
              <div className="text-2xl font-bold text-blue-600">{recipe.matchScore}% Match</div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ingredients</h3>
            <div className="grid gap-3">
              {recipe.ingredients.map((ingredient, idx) => {
                const hasIngredient = recipe.matchedIngredients.some((matched) =>
                  ingredient.toLowerCase().includes(matched.toLowerCase())
                );
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      hasIngredient ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        hasIngredient ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    >
                      {hasIngredient && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`font-medium ${hasIngredient ? 'text-green-800' : 'text-gray-700'}`}>
                      {ingredient}
                    </span>
                  </div>
                );
              })}
            </div>

            {missingIngredients.length > 0 && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-semibold text-yellow-800 mb-2">
                  You'll need to get: {missingIngredients.join(', ')}
                </p>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Instructions</h3>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, idx) => (
                <li key={idx} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <p className="text-gray-700 leading-relaxed pt-1">{instruction}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
