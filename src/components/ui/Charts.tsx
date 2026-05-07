import React from "react";

// ==================== LINE CHART ====================
interface LineChartProps {
    data: number[];
    labels?: string[];
    height?: number;
    color?: string;
    showArea?: boolean;
}

export function LineChart({
    data,
    labels = [],
    height = 120,
    color = "#10b981",
    showArea = true,
}: LineChartProps) {
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min || 1;

    const points = data.map((value, i) => ({
        x: (i / (data.length - 1 || 1)) * 100,
        y: 100 - ((value - min) / range) * 100,
    }));

    const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const areaD = `${pathD} L 100 100 L 0 100 Z`;

    return (
        <div className="relative min-w-0" style={{ height }}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                {showArea && (
                    <path d={areaD} fill={`${color}20`} />
                )}
                <path d={pathD} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
                {points.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} vectorEffect="non-scaling-stroke" />
                ))}
            </svg>
            {labels.length > 0 && (
                <div className="flex justify-between mt-2 text-xs text-slate-400 gap-2">
                    {labels.map((label, i) => (
                        <span key={i} className="truncate">{label}</span>
                    ))}
                </div>
            )}
        </div>
    );
}

// ==================== BAR CHART ====================
interface BarChartProps {
    data: { label: string; value: number; color?: string }[];
    height?: number;
    showValues?: boolean;
}

export function BarChart({ data, height = 150, showValues = true }: BarChartProps) {
    const max = Math.max(...data.map((d) => d.value), 1);

    return (
        <div className="flex items-end gap-1 sm:gap-2 min-w-0" style={{ height }}>
            {data.map((item, i) => {
                const barHeight = (item.value / max) * 100;
                const bgColor = item.color || ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"][i % 5];
                return (
                    <div key={i} className="flex-1 min-w-0 flex flex-col items-center gap-1">
                        <div className="w-full relative" style={{ height: height - 30 }}>
                            <div
                                className="absolute bottom-0 w-full rounded-t-md transition-all duration-500"
                                style={{ height: `${barHeight}%`, backgroundColor: bgColor }}
                            />
                            {showValues && (
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-medium text-slate-700 dark:text-slate-300 hidden sm:block">
                                    {item.value.toLocaleString()}
                                </div>
                            )}
                        </div>
                        <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 text-center truncate w-full">{item.label}</span>
                    </div>
                );
            })}
        </div>
    );
}

// ==================== PIE/DONUT CHART ====================
interface PieChartProps {
    data: { label: string; value: number; color: string }[];
    size?: number;
    donut?: boolean;
    showLabels?: boolean;
}

export function PieChart({ data, size = 120, donut = true, showLabels = true }: PieChartProps) {
    const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
    const radius = 40;
    const strokeWidth = donut ? 12 : 40;
    let currentAngle = -90;

    const segments = data.map((item) => {
        const angle = (item.value / total) * 360;
        const startAngle = currentAngle;
        currentAngle += angle;
        return { ...item, startAngle, angle };
    });

    const polarToCartesian = (angle: number) => {
        const rad = (angle * Math.PI) / 180;
        return { x: 50 + radius * Math.cos(rad), y: 50 + radius * Math.sin(rad) };
    };

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 min-w-0">
            <svg viewBox="0 0 100 100" style={{ width: size, height: size }}>
                {segments.map((seg, i) => {
                    const start = polarToCartesian(seg.startAngle);
                    const end = polarToCartesian(seg.startAngle + seg.angle);
                    const largeArc = seg.angle > 180 ? 1 : 0;
                    const d = `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
                    return (
                        <path
                            key={i}
                            d={d}
                            fill="none"
                            stroke={seg.color}
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                        />
                    );
                })}
                {donut && (
                    <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" className="text-lg font-bold fill-slate-700 dark:fill-slate-200">
                        {total.toLocaleString()}
                    </text>
                )}
            </svg>
            {showLabels && (
                <div className="flex flex-col gap-1.5 text-xs w-full sm:w-auto">
                    {data.map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                            <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                            <span className="text-slate-900 dark:text-slate-100 font-medium">{item.value}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ==================== SPARKLINE ====================
interface SparklineProps {
    data: number[];
    color?: string;
    height?: number;
}

export function Sparkline({ data, color = "#10b981", height = 40 }: SparklineProps) {
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min || 1;

    const points = data.map((value, i) => ({
        x: (i / (data.length - 1 || 1)) * 100,
        y: 100 - ((value - min) / range) * 80,
    }));

    const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

    return (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ height, width: "100%" }}>
            <path d={pathD} fill="none" stroke={color} strokeWidth="3" vectorEffect="non-scaling-stroke" />
        </svg>
    );
}

// ==================== PROGRESS RING ====================
interface ProgressRingProps {
    percent: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    label?: string;
    textColor?: string;
    bgColor?: string;
}

export function ProgressRing({
    percent,
    size = 80,
    strokeWidth = 8,
    color = "#10b981",
    label,
    textColor = "#1e293b",
    bgColor = "#e2e8f0",
}: ProgressRingProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <svg width={size} height={size}>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={bgColor}
                    strokeWidth={strokeWidth}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
                <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fill: textColor, fontSize: size * 0.18, fontWeight: 700 }}
                >
                    {percent}%
                </text>
            </svg>
            {label && <span className="mt-1 text-xs text-slate-500">{label}</span>}
        </div>
    );
}
