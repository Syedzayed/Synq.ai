"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";

interface TagSelectorProps {
  presets: string[];
  selected: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxCustomLength?: number;
}

export function TagSelector({
  presets,
  selected,
  onChange,
  placeholder = "Add custom...",
  maxCustomLength = 30,
}: TagSelectorProps) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggle = (tag: string) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else {
      onChange([...selected, tag]);
    }
  };

  const addCustom = () => {
    const val = inputValue.trim();
    if (!val || selected.includes(val)) {
      setInputValue("");
      return;
    }
    onChange([...selected, val]);
    setInputValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addCustom();
    }
    if (e.key === "Backspace" && !inputValue && selected.length > 0) {
      onChange(selected.slice(0, -1));
    }
  };

  // Tags not in presets (custom entries)
  const customTags = selected.filter((t) => !presets.includes(t));

  return (
    <div className="flex flex-col gap-4">
      {/* Preset tags */}
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {presets.map((tag) => {
            const isSelected = selected.includes(tag);
            return (
              <motion.button
                key={tag}
                type="button"
                onClick={() => toggle(tag)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.18 }}
                className="px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 select-none"
                style={
                  isSelected
                    ? {
                        background:
                          "linear-gradient(135deg, #e07a5f 0%, #d4694f 100%)",
                        color: "white",
                        border: "1.5px solid transparent",
                        boxShadow: "0 2px 8px rgba(224,122,95,0.3)",
                      }
                    : {
                        background: "#f8f4ef",
                        color: "#3a3530",
                        border: "1.5px solid rgba(232,226,216,0.9)",
                      }
                }
              >
                {tag}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Custom tags row */}
      {customTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {customTags.map((tag) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.18 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium"
                style={{
                  background: "rgba(224,122,95,0.1)",
                  color: "#c9604a",
                  border: "1.5px solid rgba(224,122,95,0.25)",
                }}
              >
                {tag}
                <button
                  type="button"
                  onClick={() => toggle(tag)}
                  className="ml-0.5 rounded-full hover:bg-red-100 transition-colors"
                  aria-label={`Remove ${tag}`}
                >
                  <X size={11} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Custom input */}
      <div
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl transition-all duration-200 cursor-text"
        style={{
          background: "#f8f4ef",
          border: isFocused
            ? "1.5px solid rgba(224,122,95,0.6)"
            : "1.5px solid rgba(232,226,216,0.9)",
          boxShadow: isFocused ? "0 0 0 3px rgba(224,122,95,0.08)" : "none",
        }}
        onClick={() => inputRef.current?.focus()}
      >
        <Plus size={13} style={{ color: "#b8b2aa", flexShrink: 0 }} />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) =>
            setInputValue(e.target.value.slice(0, maxCustomLength))
          }
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            if (inputValue.trim()) addCustom();
          }}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-[13.5px]"
          style={{ color: "#1e1a17" }}
        />
        {inputValue.trim() && (
          <motion.button
            type="button"
            onClick={addCustom}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[11px] font-semibold px-2 py-0.5 rounded-lg"
            style={{
              background: "rgba(224,122,95,0.12)",
              color: "#e07a5f",
            }}
          >
            Add ↵
          </motion.button>
        )}
      </div>
      <p className="text-[11.5px]" style={{ color: "#b8b2aa" }}>
        Press Enter or comma to add custom tags
      </p>
    </div>
  );
}
