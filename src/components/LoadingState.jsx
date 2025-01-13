// src/components/LoadingState.jsx
export function LoadingState() {
  return (
    <div className="min-h-screen w-full">
      {/* Background placeholder */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 animate-pulse"
        style={{
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Loading spinner overlay */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500" />
          <div className="text-gray-300 text-sm animate-pulse">
            Loading...
          </div>
        </div>
      </div>
    </div>
  );
}