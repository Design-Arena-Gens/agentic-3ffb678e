'use client';

import { DietaryFilter, DifficultyFilter, SortOption } from '@/types/recipe';

interface FilterPanelProps {
  dietaryFilters: DietaryFilter[];
  maxTime: number;
  difficulty: DifficultyFilter | '';
  sortBy: SortOption;
  onDietaryChange: (filters: DietaryFilter[]) => void;
  onMaxTimeChange: (time: number) => void;
  onDifficultyChange: (difficulty: DifficultyFilter | '') => void;
  onSortByChange: (sort: SortOption) => void;
}

export default function FilterPanel({
  dietaryFilters,
  maxTime,
  difficulty,
  sortBy,
  onDietaryChange,
  onMaxTimeChange,
  onDifficultyChange,
  onSortByChange,
}: FilterPanelProps) {
  const toggleDietary = (filter: DietaryFilter) => {
    if (dietaryFilters.includes(filter)) {
      onDietaryChange(dietaryFilters.filter((f) => f !== filter));
    } else {
      onDietaryChange([...dietaryFilters, filter]);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Filters & Sort</h2>

      <div className="space-y-6">
        {/* Dietary Filters */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Dietary Preferences</label>
          <div className="space-y-2">
            {(['vegetarian', 'vegan', 'gluten-free'] as DietaryFilter[]).map((filter) => (
              <label key={filter} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={dietaryFilters.includes(filter)}
                  onChange={() => toggleDietary(filter)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span className="ml-3 text-gray-700 group-hover:text-blue-600 transition-colors capitalize">
                  {filter}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Max Cooking Time */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Max Cooking Time: <span className="text-blue-600">{maxTime === 300 ? 'Any' : `${maxTime} min`}</span>
          </label>
          <input
            type="range"
            min="15"
            max="300"
            step="15"
            value={maxTime}
            onChange={(e) => onMaxTimeChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>15 min</span>
            <span>300 min</span>
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Difficulty Level</label>
          <select
            value={difficulty}
            onChange={(e) => onDifficultyChange(e.target.value as DifficultyFilter | '')}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700 cursor-pointer"
          >
            <option value="">All levels</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as SortOption)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700 cursor-pointer"
          >
            <option value="match">Best Match</option>
            <option value="time">Cooking Time</option>
            <option value="difficulty">Difficulty</option>
          </select>
        </div>
      </div>
    </div>
  );
}
