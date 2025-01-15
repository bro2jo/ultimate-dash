export function LoadingState({ size = 'h-16 w-16', color = 'emerald-500', text = 'Loading...' }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
      <div className="flex flex-col items-center gap-4">
        {/* Loading Spinner */}
        <div
          className={`animate-spin rounded-full ${size} border-t-4 border-b-4 border-${color}`}
          role="status"
          aria-label="Loading"
        />
        {/* Loading Text */}
        <div className="text-gray-300 text-lg">{text}</div>
      </div>
    </div>
  );
}
