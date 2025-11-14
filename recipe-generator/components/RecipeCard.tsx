'use client';

import { RecipeMatch } from '@/types/recipe';
import { Clock, ChefHat, Users } from 'lucide-react';

interface RecipeCardProps {
  recipe: RecipeMatch;
  onClick: () => void;
}

export default function RecipeCard({ recipe, onClick }: RecipeCardProps) {
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 hover:border-blue-400 overflow-hidden group"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {recipe.title}
          </h3>
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1 rounded-full ${getScoreColor(recipe.matchScore)} text-white font-bold text-sm`}>
              {recipe.matchScore}%
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(recipe.difficulty)}`}>
            {recipe.difficulty}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold text-purple-700 bg-purple-100">
            {recipe.cuisine}
          </span>
          {recipe.dietary.map((diet, idx) => (
            <span key={idx} className="px-2.5 py-1 rounded-full text-xs font-semibold text-blue-700 bg-blue-100">
              {diet}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1.5">
            <Clock size={16} />
            <span>{recipe.cookingTime} min</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={16} />
            <span>{recipe.servings} servings</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ChefHat size={16} />
            <span>{recipe.ingredients.length} ingredients</span>
          </div>
        </div>

        {recipe.matchedIngredients.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">You have:</p>
            <div className="flex flex-wrap gap-1.5">
              {recipe.matchedIngredients.slice(0, 8).map((ing, idx) => (
                <span key={idx} className="px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium">
                  {ing}
                </span>
              ))}
              {recipe.matchedIngredients.length > 8 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                  +{recipe.matchedIngredients.length - 8} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
