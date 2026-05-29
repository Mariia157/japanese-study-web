import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatJlpt(level: number): string {
  return `N${level}`;
}

export const JLPT_LEVELS = [5, 4, 3, 2, 1] as const;
export type JlptLevel = (typeof JLPT_LEVELS)[number];
