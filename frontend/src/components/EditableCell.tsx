import { useState, useEffect, useRef } from 'react';

interface EditableCellProps {
  value: string;
  onSave: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}

export function EditableCell({
  value,
  onSave,
  placeholder = '',
  multiline = false,
}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing) {
      if (multiline) {
        textareaRef.current?.focus();
      } else {
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }
  }, [isEditing, multiline]);

  const handleSave = () => {
    const trimmedValue = editValue.trim();
    if (trimmedValue && trimmedValue !== value) {
      onSave(trimmedValue);
    } else {
      setEditValue(value);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Enter' && multiline && e.ctrlKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2 w-full">
        {multiline ? (
          <textarea
            ref={textareaRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            placeholder={placeholder}
            rows={3}
            className="
              w-full px-3 py-2 text-sm border border-blue-500 rounded-md
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              resize-none
            "
            aria-label="Edit field"
          />
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            placeholder={placeholder}
            className="
              w-full px-3 py-2 text-sm border border-blue-500 rounded-md
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            "
            aria-label="Edit field"
          />
        )}
        <p className="text-xs text-gray-500">
          {multiline ? 'Press Ctrl+Enter to save, Esc to cancel' : 'Press Enter to save, Esc to cancel'}
        </p>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="
        w-full text-left px-3 py-2 text-sm text-gray-900 rounded-md
        hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500
        transition-colors duration-150 group
      "
      aria-label={`Edit ${placeholder || 'field'}`}
    >
      <span className="break-words">{value || <span className="text-gray-400">Click to edit</span>}</span>
      <span className="ml-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg
          className="inline-block w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
      </span>
    </button>
  );
}
