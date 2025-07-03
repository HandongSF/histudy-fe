"use client";

interface SpinnerLoadingProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export function SpinnerLoading({
  width = 40,
  height = 40,
  className = "",
}: SpinnerLoadingProps) {
  return (
    <div
      className={`flex items-center justify-center bg-white rounded-lg border shadow-sm ${className}`}
      style={{ width, height }}
    >
      <div className="relative">
        <div
          className="animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"
          style={{
            width: Math.min(Number(width) * 0.6, Number(height) * 0.6),
            height: Math.min(Number(width) * 0.6, Number(height) * 0.6),
          }}
        />
      </div>
    </div>
  );
}
