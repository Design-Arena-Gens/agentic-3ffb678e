'use client';

import { useState, ChangeEvent } from 'react';
import { Upload, Image as ImageIcon, X, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  onIngredientsDetected: (ingredients: string[]) => void;
}

export default function ImageUpload({ onIngredientsDetected }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, etc.)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    setPreview(URL.createObjectURL(file));

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;

        try {
          const response = await fetch('/api/detect-ingredients', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64 }),
          });

          if (!response.ok) {
            throw new Error('Failed to detect ingredients');
          }

          const data = await response.json();
          setDetectedIngredients(data.ingredients || []);
          setShowConfirmation(true);
        } catch (err) {
          setError('Failed to detect ingredients. Please try again or enter them manually.');
          console.error(err);
        } finally {
          setUploading(false);
        }
      };

      reader.readAsDataURL(file);
    } catch (err) {
      setError('Failed to process image');
      setUploading(false);
      console.error(err);
    }
  };

  const handleConfirm = () => {
    onIngredientsDetected(detectedIngredients);
    resetUpload();
  };

  const handleEditIngredient = (index: number, newValue: string) => {
    const updated = [...detectedIngredients];
    updated[index] = newValue;
    setDetectedIngredients(updated);
  };

  const handleRemoveIngredient = (index: number) => {
    setDetectedIngredients(detectedIngredients.filter((_, i) => i !== index));
  };

  const resetUpload = () => {
    setPreview(null);
    setDetectedIngredients([]);
    setShowConfirmation(false);
    setError(null);
  };

  return (
    <div className="w-full">
      {!showConfirmation ? (
        <div className="relative">
          <label
            htmlFor="image-upload"
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
              uploading
                ? 'border-gray-300 bg-gray-50'
                : 'border-gray-400 hover:border-blue-500 hover:bg-blue-50'
            }`}
          >
            {uploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                <p className="text-sm text-gray-600">Detecting ingredients...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 font-medium">Upload food image</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
              </div>
            )}
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </div>
      ) : (
        <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
          <div className="flex items-start gap-4 mb-4">
            {preview && (
              <div className="relative w-24 h-24 flex-shrink-0">
                <img
                  src={preview}
                  alt="Uploaded food"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-2">Detected Ingredients</h3>
              <p className="text-sm text-gray-600 mb-3">Review and edit as needed:</p>
              <div className="space-y-2">
                {detectedIngredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={ingredient}
                      onChange={(e) => handleEditIngredient(index, e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm"
                    />
                    <button
                      onClick={() => handleRemoveIngredient(index)}
                      className="p-1.5 hover:bg-red-100 rounded-md transition-colors"
                      aria-label="Remove ingredient"
                    >
                      <X size={16} className="text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add These Ingredients
            </button>
            <button
              onClick={resetUpload}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
