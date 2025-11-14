'use client';

import { useState } from 'react';
import { RecipeMatch, DietaryFilter, DifficultyFilter, SortOption } from '@/types/recipe';
import { filterAndSortRecipes } from '@/lib/recipeUtils';
import IngredientInput from '@/components/IngredientInput';
import ImageUpload from '@/components/ImageUpload';
import FilterPanel from '@/components/FilterPanel';
import RecipeCard from '@/components/RecipeCard';
import RecipeModal from '@/components/RecipeModal';
import { ChefHat, Sparkles } from 'lucide-react';

export default function Home() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<RecipeMatch[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeMatch | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Filters
  const [dietaryFilters, setDietaryFilters] = useState<DietaryFilter[]>([]);
  const [maxTime, setMaxTime] = useState<number>(300);
  const [difficulty, setDifficulty] = useState<DifficultyFilter | ''>('');
  const [sortBy, setSortBy] = useState<SortOption>('match');

  const handleSearch = () => {
    if (ingredients.length === 0) {
      alert('Please add at least one ingredient');
      return;
    }

    const results = filterAndSortRecipes(
      ingredients,
      dietaryFilters,
      maxTime === 300 ? undefined : maxTime,
      difficulty || undefined,
      sortBy
    );

    setRecipes(results);
    setHasSearched(true);
  };

  const handleIngredientsDetected = (detectedIngredients: string[]) => {
    setIngredients([...ingredients, ...detectedIngredients]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-3 rounded-xl">
              <ChefHat size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Smart Recipe Generator</h1>
              <p className="text-gray-600 text-sm">Find perfect recipes based on your ingredients</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="text-blue-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">What ingredients do you have?</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Type your ingredients
              </label>
              <IngredientInput ingredients={ingredients} onIngredientsChange={setIngredients} />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Upload a photo of your ingredients
              </label>
              <ImageUpload onIngredientsDetected={handleIngredientsDetected} />
            </div>

            <button
              onClick={handleSearch}
              disabled={ingredients.length === 0}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-lg"
            >
              Find Recipes ({ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''})
            </button>
          </div>
        </div>

        {hasSearched && (
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filters */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-8">
                <FilterPanel
                  dietaryFilters={dietaryFilters}
                  maxTime={maxTime}
                  difficulty={difficulty}
                  sortBy={sortBy}
                  onDietaryChange={setDietaryFilters}
                  onMaxTimeChange={setMaxTime}
                  onDifficultyChange={setDifficulty}
                  onSortByChange={setSortBy}
                />
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {recipes.length} Recipe{recipes.length !== 1 ? 's' : ''} Found
                </h2>
                <p className="text-gray-600 mt-1">
                  Sorted by {sortBy === 'match' ? 'best match' : sortBy === 'time' ? 'cooking time' : 'difficulty'}
                </p>
              </div>

              {recipes.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-200">
                  <div className="text-gray-400 mb-4">
                    <ChefHat size={64} className="mx-auto" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No recipes found</h3>
                  <p className="text-gray-600">
                    Try adjusting your filters or adding more ingredients
                  </p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {recipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onClick={() => setSelectedRecipe(recipe)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          <p>&copy; 2025 Smart Recipe Generator. Made with ❤️ and AI.</p>
        </div>
      </footer>
    </div>
  );
}
