"use client";

interface SkeletonLoadingProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export function SkeletonLoading({
  width = 200,
  height = 100,
  className = "",
}: SkeletonLoadingProps) {
  return (
    <div
      className={`bg-gray-200 rounded-lg animate-pulse ${className}`}
      style={{ width, height }}
    >
      <div className="p-4 space-y-3 h-full flex flex-col justify-center">
        <div
          className="h-3 bg-gray-300 rounded-full animate-pulse"
          style={{ width: "75%" }}
        />
        <div
          className="h-3 bg-gray-300 rounded-full animate-pulse"
          style={{ width: "50%" }}
        />
        <div
          className="h-3 bg-gray-300 rounded-full animate-pulse"
          style={{ width: "60%" }}
        />
      </div>
    </div>
  );
}
