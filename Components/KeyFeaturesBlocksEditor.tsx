"use client";

import { KeyFeatureBlock } from "@/lib/models/DTOs/MiniToolDto";
import { ImageUploadComponent } from "@/Components/ImageUploadComponent";

type KeyFeaturesBlocksEditorProps = {
  keyFeatures: KeyFeatureBlock[];
  onChange: (keyFeatures: KeyFeatureBlock[]) => void;
};

export default function KeyFeaturesBlocksEditor({
  keyFeatures,
  onChange,
}: KeyFeaturesBlocksEditorProps) {
  const handleAddFeature = () => {
    onChange([
      ...keyFeatures,
      { image: "", title: "", description: "" },
    ]);
  };

  const handleRemoveFeature = (index: number) => {
    const newFeatures = [...keyFeatures];
    newFeatures.splice(index, 1);
    onChange(newFeatures);
  };

  const handleUpdateFeature = (
    index: number,
    field: keyof KeyFeatureBlock,
    value: string
  ) => {
    const newFeatures = [...keyFeatures];
    newFeatures[index] = {
      ...newFeatures[index],
      [field]: value,
    };
    onChange(newFeatures);
  };

  return (
    <div className="flex flex-col gap-4 md:col-span-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-zinc-700">
          Key Features
        </label>
        <button
          type="button"
          onClick={handleAddFeature}
          className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700"
        >
          + Add Feature
        </button>
      </div>

      {keyFeatures.length > 0 ? (
        <div className="flex flex-col gap-4">
          {keyFeatures.map((feature, index) => (
            <div
              key={index}
              className="relative rounded-lg border border-zinc-200 bg-zinc-50 p-4"
            >
              <button
                type="button"
                onClick={() => handleRemoveFeature(index)}
                className="absolute right-2 top-2 rounded-md p-1 text-red-600 transition hover:bg-red-50"
                aria-label="Remove feature"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-zinc-700">Icon Image</label>
                  <ImageUploadComponent
                    onConverted={(base64) =>
                      handleUpdateFeature(index, "image", base64)
                    }
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="flex flex-col gap-1 text-xs font-medium text-zinc-700">
                    Title
                    <input
                      type="text"
                      placeholder="Feature title"
                      className="rounded border border-zinc-300 px-3 py-1.5 text-sm text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      required
                      value={feature.title}
                      onChange={(e) =>
                        handleUpdateFeature(index, "title", e.target.value)
                      }
                    />
                  </label>

                  <label className="flex flex-col gap-1 text-xs font-medium text-zinc-700">
                    Description
                    <textarea
                      placeholder="Short description of this feature"
                      className="h-20 rounded border border-zinc-300 px-3 py-1.5 text-sm text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      required
                      value={feature.description}
                      onChange={(e) =>
                        handleUpdateFeature(index, "description", e.target.value)
                      }
                    />
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-zinc-300 bg-white p-6 text-center text-sm text-zinc-500">
          No key features added yet. Click "Add Feature" to add one.
        </div>
      )}
    </div>
  );
}
