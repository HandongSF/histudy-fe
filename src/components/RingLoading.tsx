"use client";

interface RingLoadingProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export function RingLoading({
  width = 80,
  height = 80,
  className = "",
}: RingLoadingProps) {
  return (
    <div
      className={`flex items-center justify-center bg-white rounded-lg border shadow-sm ${className}`}
      style={{ width, height }}
    >
      <div className="relative">
        <div
          className="animate-spin rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600"
          style={{
            width: Math.min(Number(width) * 0.6, Number(height) * 0.6),
            height: Math.min(Number(width) * 0.6, Number(height) * 0.6),
          }}
        />
      </div>
    </div>
  );
}
