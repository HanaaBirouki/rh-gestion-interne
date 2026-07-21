// frontend/src/lib/utils.js
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combine les classes CSS avec clsx et tailwind-merge
 * Utile pour les composants UI avec des classes conditionnelles
 * 
 * @param {...any} inputs - Classes CSS à combiner
 * @returns {string} - Classes CSS combinées
 * 
 * @example
 * cn("bg-red-500", isActive && "bg-blue-500", "text-white")
 * // => "bg-red-500 text-white" ou "bg-blue-500 text-white" selon isActive
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}