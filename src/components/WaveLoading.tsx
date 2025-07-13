interface WaveLoadingProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export function WaveLoading({
  width = "100%",
  height = "100%",
  className = "",
}: WaveLoadingProps) {
  return (
    <div
      className={`flex justify-center opacity-50 items-center ${className}`}
      style={{ width, height }}
    >
      <div className="flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-2 bg-gray-600 rounded-full animate-pulse"
            style={{
              height: "20px",
              animationDelay: `${i * 100}ms`,
              animationDuration: "1s",
            }}
          />
        ))}
      </div>
    </div>
  );
}
