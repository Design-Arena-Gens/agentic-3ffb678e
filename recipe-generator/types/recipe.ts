export interface Recipe {
  id: number;
  title: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  dietary: string[];
  cuisine: string;
  servings: number;
}

export interface RecipeMatch extends Recipe {
  matchScore: number;
  matchedIngredients: string[];
}

export type DietaryFilter = 'vegetarian' | 'vegan' | 'gluten-free';
export type DifficultyFilter = 'easy' | 'medium' | 'hard';
export type SortOption = 'match' | 'time' | 'difficulty';
