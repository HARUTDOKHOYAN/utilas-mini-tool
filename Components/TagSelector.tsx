"use client";

import { useState, useEffect, useRef } from "react";

type TagSelectorProps = {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
};

export default function TagSelector({ selectedTags, onChange }: TagSelectorProps) {
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function fetchTags() {
    try {
      setLoading(true);
      const response = await fetch("/api/tags");
      if (response.ok) {
        const tags = await response.json();
        setAvailableTags(tags);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    } finally {
      setLoading(false);
    }
  }

  async function createTag(name: string) {
    try {
      const normalizedName = name.trim().toLowerCase();
      if (!normalizedName || selectedTags.includes(normalizedName)) {
        return;
      }

      const response = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: normalizedName }),
      });

      if (response.ok) {
        const data = await response.json();
        // Refresh available tags
        await fetchTags();
        // Add to selected tags
        onChange([...selectedTags, normalizedName]);
        setInputValue("");
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Error creating tag:", error);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(value.length > 0);
  }

  function handleSelectTag(tag: string) {
    if (!selectedTags.includes(tag)) {
      onChange([...selectedTags, tag]);
    }
    setInputValue("");
    setShowSuggestions(false);
  }

  function handleRemoveTag(tag: string) {
    onChange(selectedTags.filter((t) => t !== tag));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const normalizedName = inputValue.trim().toLowerCase();
      if (!selectedTags.includes(normalizedName)) {
        createTag(normalizedName);
      } else {
        setInputValue("");
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  }

  const filteredTags = availableTags.filter(
    (tag) =>
      tag.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedTags.includes(tag)
  );

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-zinc-700">Tags</label>
      <div className="relative">
        <div className="flex flex-wrap gap-2 min-h-[42px] p-2 rounded border border-zinc-300 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded border border-blue-200"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-blue-600 hover:text-blue-800 transition"
                aria-label={`Remove ${tag}`}
              >
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(inputValue.length > 0)}
            placeholder={selectedTags.length === 0 ? "Add tags..." : ""}
            className="flex-1 min-w-[120px] outline-none text-sm text-zinc-900 placeholder:text-zinc-400"
          />
        </div>

        {showSuggestions && (filteredTags.length > 0 || inputValue.trim()) && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 w-full mt-1 max-h-48 overflow-y-auto rounded-md border border-zinc-200 bg-white shadow-lg"
          >
            {filteredTags.length > 0 && (
              <div className="py-1">
                {filteredTags.slice(0, 10).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleSelectTag(tag)}
                    className="w-full text-left px-4 py-2 text-sm text-zinc-900 hover:bg-blue-50 transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
            {inputValue.trim() &&
              !availableTags
                .map((t) => t.toLowerCase())
                .includes(inputValue.trim().toLowerCase()) &&
              !selectedTags.includes(inputValue.trim().toLowerCase()) && (
                <div className="border-t border-zinc-200 py-1">
                  <button
                    type="button"
                    onClick={() => createTag(inputValue)}
                    className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition font-medium"
                  >
                    + Create "{inputValue.trim()}"
                  </button>
                </div>
              )}
          </div>
        )}
      </div>
      <span className="text-xs text-zinc-500">
        Type to search existing tags or press Enter to create a new one.
      </span>
    </div>
  );
}

