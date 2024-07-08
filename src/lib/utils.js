import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const isEq = (a, b) => a === b;

export function calculateStatistics(data) {
  const n = data.length;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const sum = data.reduce((a, b) => a + b, 0);
  const mean = sum / n;

  const variance = data.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
  const stdDev = Math.sqrt(variance);

  return {
    min,
    avg: mean,
    max,
    stdDev
  };
}
