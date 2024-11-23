import { RotateCcw, Minus, Plus } from "lucide-react";
import { Category, getCategoryColorName } from "./model";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ZoomControlsProps {
    onZoomIn: () => void;
    onZoomOut: () => void;
    onReset: () => void;
}

export function ZoomControls({ onZoomIn, onZoomOut, onReset }: ZoomControlsProps) {
    return (
        <div className="flex flex-row gap-1 p-1 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border">
            <Button
                variant="ghost"
                size="icon"
                onClick={onZoomIn}
                className="h-8 w-8"
                aria-label="Zoom in"
            >
                <Plus className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={onZoomOut}
                className="h-8 w-8"
                aria-label="Zoom out"
            >
                <Minus className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={onReset}
                className="h-8 w-8"
                aria-label="Reset zoom"
            >
                <RotateCcw className="h-4 w-4" />
            </Button>
        </div>
    );
}

interface LabelsProps {
    categories: Category[];
    className?: string;
    onClick: (category: Category) => void;
}

const ICON_COLORS = {
    0: "text-red-500",
    1: "text-yellow-500",
    2: "text-emerald-500",
} as const;

export function Labels({ categories, className, onClick }: LabelsProps) {
    return (
        <div className={cn("flex flex-row items-center gap-4", className)}>
            {categories.map((category) => (
                <div
                    key={category.index}
                    className="flex flex-row items-center gap-2"
                >
                    <Button
                        variant="ghost"
                        onClick={() => onClick(category)}
                        className={cn(
                            "h-8 w-8 p-0",
                            !category.show && "opacity-50",
                            "transition-opacity duration-200 hover:bg-transparent"
                        )}
                        aria-label={`${category.show ? 'Hide' : 'Show'} ${category.name}`}
                    >
                        {category.show ? (
                            <Minus className={cn("h-4 w-4", ICON_COLORS[category.index as keyof typeof ICON_COLORS])} />
                        ) : (
                            <Plus className={cn("h-4 w-4", ICON_COLORS[category.index as keyof typeof ICON_COLORS])} />
                        )}
                    </Button>
                    <span className="text-sm font-medium">{category.name}</span>
                </div>
            ))}
        </div>
    );
}