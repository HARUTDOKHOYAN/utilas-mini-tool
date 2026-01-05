"use client";

import { useState, useEffect, useRef } from "react";

type ComponentSelectorProps = {
  selectedComponents: string[];
  onChange: (components: string[]) => void;
};

export default function ComponentSelector({ selectedComponents, onChange }: ComponentSelectorProps) {
  const [availableComponents, setAvailableComponents] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchComponents();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function fetchComponents() {
    try {
      setLoading(true);
      const response = await fetch("/api/components");
      if (response.ok) {
        const components = await response.json();
        setAvailableComponents(components);
      }
    } catch (error) {
      console.error("Error fetching components:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredComponents = availableComponents.filter(
    (component) =>
      component.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedComponents.includes(component)
  );

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setInputValue(value);
    setIsOpen(true);
    setHighlightedIndex(-1);
  }

  function handleSelectComponent(component: string) {
    if (!selectedComponents.includes(component)) {
      onChange([...selectedComponents, component]);
    }
    setInputValue("");
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  }

  function handleRemoveComponent(component: string) {
    onChange(selectedComponents.filter((c) => c !== component));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen) {
      if (e.key === "ArrowDown") {
        setIsOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredComponents.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredComponents.length) {
          handleSelectComponent(filteredComponents[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
      case "Backspace":
        if (inputValue === "" && selectedComponents.length > 0) {
          handleRemoveComponent(selectedComponents[selectedComponents.length - 1]);
        }
        break;
    }
  }

  return (
    <div className="flex flex-col gap-2" ref={containerRef}>
      <label className="text-sm font-medium text-zinc-700">Components</label>
      <div className="relative">
        <div className="flex flex-wrap gap-2 min-h-[42px] p-2 rounded-md border border-zinc-300 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
          {selectedComponents.map((component, index) => (
            <span
              key={component}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-md border border-green-300"
            >
              {component}
              <button
                type="button"
                onClick={() => handleRemoveComponent(component)}
                className="text-green-600 hover:text-green-800 transition-colors ml-1"
                aria-label={`Remove ${component}`}
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
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsOpen(true)}
              placeholder={selectedComponents.length === 0 ? "Search existing components..." : ""}
              className="w-full outline-none text-sm text-zinc-900 placeholder:text-zinc-400"
            />
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="absolute right-0 top-0 h-full px-2 text-zinc-400 hover:text-zinc-600"
            >
              <svg
                className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto rounded-md border border-zinc-200 bg-white shadow-lg">
            {loading ? (
              <div className="px-4 py-3 text-sm text-zinc-500">Loading components...</div>
            ) : filteredComponents.length > 0 ? (
              <div className="py-1">
                {filteredComponents.map((component, index) => (
                  <button
                    key={component}
                    type="button"
                    onClick={() => handleSelectComponent(component)}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      index === highlightedIndex
                        ? 'bg-blue-50 text-blue-900'
                        : 'text-zinc-900 hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{component}</span>
                      {index === highlightedIndex && (
                        <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : inputValue.trim() ? (
              <div className="px-4 py-3 text-sm text-zinc-500">
                No components found matching "{inputValue}".
              </div>
            ) : (
              <div className="px-4 py-3 text-sm text-zinc-500">
                Start typing to search components...
              </div>
            )}
          </div>
        )}
      </div>
      <span className="text-xs text-zinc-500">
        Select multiple components from the existing database list. Use arrow keys to navigate, Enter to select.
      </span>
    </div>
  );
}
