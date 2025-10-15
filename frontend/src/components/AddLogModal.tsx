import { useEffect, useRef, useState } from 'react';

interface AddLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (owner: string, logText: string) => Promise<void>;
  isCreating?: boolean;
}

export function AddLogModal({
  isOpen,
  onClose,
  onSubmit,
  isCreating = false,
}: AddLogModalProps) {
  const [owner, setOwner] = useState('');
  const [logText, setLogText] = useState('');
  const [errors, setErrors] = useState<{ owner?: string; logText?: string }>({});
  const ownerInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      ownerInputRef.current?.focus();
      document.body.style.overflow = 'hidden';

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleClose();
        }
      };

      document.addEventListener('keydown', handleEscape);

      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen]);

  const handleClose = () => {
    setOwner('');
    setLogText('');
    setErrors({});
    onClose();
  };

  const validate = () => {
    const newErrors: { owner?: string; logText?: string } = {};

    if (!owner.trim()) {
      newErrors.owner = 'Owner is required';
    }

    if (!logText.trim()) {
      newErrors.logText = 'Log text is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await onSubmit(owner.trim(), logText.trim());
      handleClose();
    } catch (error) {
      console.error('Failed to create log:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-scaleIn"
      >
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full">
          <svg
            className="w-6 h-6 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>

        <div className="text-center mb-6">
          <h3
            id="add-modal-title"
            className="text-lg font-semibold text-gray-900 mb-2"
          >
            Create New Log
          </h3>
          <p className="text-sm text-gray-600">
            Add a new log entry to the system
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="owner"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Owner <span className="text-red-500">*</span>
            </label>
            <input
              ref={ownerInputRef}
              type="text"
              id="owner"
              value={owner}
              onChange={(e) => {
                setOwner(e.target.value);
                if (errors.owner) setErrors({ ...errors, owner: undefined });
              }}
              className={`
                w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2
                ${
                  errors.owner
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }
              `}
              placeholder="Enter owner name"
              disabled={isCreating}
              aria-invalid={!!errors.owner}
              aria-describedby={errors.owner ? 'owner-error' : undefined}
            />
            {errors.owner && (
              <p id="owner-error" className="mt-1 text-sm text-red-600">
                {errors.owner}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="logText"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Log Text <span className="text-red-500">*</span>
            </label>
            <textarea
              id="logText"
              value={logText}
              onChange={(e) => {
                setLogText(e.target.value);
                if (errors.logText) setErrors({ ...errors, logText: undefined });
              }}
              rows={4}
              className={`
                w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 resize-none
                ${
                  errors.logText
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }
              `}
              placeholder="Enter log text..."
              disabled={isCreating}
              aria-invalid={!!errors.logText}
              aria-describedby={errors.logText ? 'logText-error' : undefined}
            />
            {errors.logText && (
              <p id="logText-error" className="mt-1 text-sm text-red-600">
                {errors.logText}
              </p>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isCreating}
              className="
                px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300
                rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2
                focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200
              "
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="
                px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent
                rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200 min-w-[100px]
              "
            >
              {isCreating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                'Create Log'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
