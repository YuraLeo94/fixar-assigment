export function LoadingSpinner() {
  return (
    <div
      className="flex items-center justify-center min-h-[400px]"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
