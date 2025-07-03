"use client";

interface DotsLoadingProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export function DotsLoading({
  width = 120,
  height = 60,
  className = "",
}: DotsLoadingProps) {
  return (
    <div
      className={`flex items-center justify-center bg-white rounded-lg border shadow-sm ${className}`}
      style={{ width, height }}
    >
      <div className="flex space-x-2">
        <div
          className="w-3 h-3 bg-gray-600 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <div
          className="w-3 h-3 bg-gray-600 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <div
          className="w-3 h-3 bg-gray-600 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}
