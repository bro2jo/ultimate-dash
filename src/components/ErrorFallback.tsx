// src/components/ErrorFallback.tsx
interface ErrorFallbackProps {
    error?: Error;
    resetErrorBoundary?: () => void;
  }
  
  const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
    error, 
    resetErrorBoundary 
  }) => {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center p-4 max-w-md">
          <h1 className="text-xl text-red-500 mb-2">
            Oops! Something went wrong
          </h1>
          <p className="text-gray-400 mb-4">
            {error?.message || 'Please try again or refresh the page'}
          </p>
          {resetErrorBoundary && (
            <button
              onClick={resetErrorBoundary}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg 
                       hover:bg-emerald-600 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  };
  
  export default ErrorFallback;