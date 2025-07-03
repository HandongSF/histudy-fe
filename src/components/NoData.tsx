import { Database, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoDataProps {
  width?: number | string;
  height?: number | string;
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export function NoData({
  width = "100%",
  height = "100%",
  title = "데이터가 없습니다",
  description = "아직 표시할 데이터가 없습니다.",
  actionText,
  onAction,
  className = "",
}: NoDataProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center bg-white rounded-lg border shadow-sm p-8 ${className}`}
      style={{ width, height }}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <Database className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 text-center mb-6 max-w-sm">
        {description}
      </p>
      {actionText && onAction && (
        <Button onClick={onAction} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {actionText}
        </Button>
      )}
    </div>
  );
}
