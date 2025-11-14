import { NextRequest, NextResponse } from 'next/server';

const CLARIFAI_API_KEY = process.env.CLARIFAI_API_KEY;
const CLARIFAI_USER_ID = 'clarifai';
const CLARIFAI_APP_ID = 'main';
const CLARIFAI_MODEL_ID = 'food-item-recognition';

// Common food ingredients mapping
const FOOD_MAPPING: Record<string, string[]> = {
  'tomato': ['tomato', 'tomatoes'],
  'potato': ['potato', 'potatoes'],
  'onion': ['onion', 'onions'],
  'garlic': ['garlic'],
  'carrot': ['carrot', 'carrots'],
  'broccoli': ['broccoli'],
  'chicken': ['chicken', 'poultry'],
  'beef': ['beef', 'steak'],
  'pork': ['pork'],
  'fish': ['fish', 'salmon', 'tuna'],
  'shrimp': ['shrimp', 'prawn'],
  'egg': ['egg', 'eggs'],
  'cheese': ['cheese', 'cheddar', 'mozzarella', 'parmesan'],
  'bread': ['bread', 'baguette', 'bun'],
  'pasta': ['pasta', 'spaghetti', 'noodle'],
  'rice': ['rice'],
  'lettuce': ['lettuce', 'salad'],
  'cucumber': ['cucumber'],
  'bell pepper': ['pepper', 'bell pepper', 'capsicum'],
  'mushroom': ['mushroom', 'mushrooms'],
  'avocado': ['avocado'],
  'lemon': ['lemon', 'lime'],
  'apple': ['apple'],
  'banana': ['banana'],
  'orange': ['orange'],
};

function mapFoodConcepts(concepts: string[]): string[] {
  const ingredients = new Set<string>();

  for (const concept of concepts) {
    const lower = concept.toLowerCase();

    // Direct match
    for (const [ingredient, keywords] of Object.entries(FOOD_MAPPING)) {
      if (keywords.some(keyword => lower.includes(keyword))) {
        ingredients.add(ingredient);
        break;
      }
    }
  }

  return Array.from(ingredients);
}

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // If no API key, return mock data for demo
    if (!CLARIFAI_API_KEY) {
      console.warn('CLARIFAI_API_KEY not set, returning mock data');
      const mockIngredients = ['tomato', 'cheese', 'lettuce', 'onion'];
      return NextResponse.json({ ingredients: mockIngredients });
    }

    // Extract base64 data
    const base64Data = image.split(',')[1] || image;

    const response = await fetch(
      `https://api.clarifai.com/v2/models/${CLARIFAI_MODEL_ID}/outputs`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Key ${CLARIFAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_app_id: {
            user_id: CLARIFAI_USER_ID,
            app_id: CLARIFAI_APP_ID,
          },
          inputs: [
            {
              data: {
                image: {
                  base64: base64Data,
                },
              },
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Clarifai API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status?.code !== 10000) {
      throw new Error('Clarifai API returned error status');
    }

    const concepts = data.outputs?.[0]?.data?.concepts || [];
    const detectedConcepts = concepts
      .filter((c: any) => c.value > 0.7)
      .map((c: any) => c.name);

    const ingredients = mapFoodConcepts(detectedConcepts);

    return NextResponse.json({ ingredients });
  } catch (error) {
    console.error('Error detecting ingredients:', error);
    return NextResponse.json(
      { error: 'Failed to detect ingredients', ingredients: [] },
      { status: 500 }
    );
  }
}
