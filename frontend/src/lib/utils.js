import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow, parseISO } from 'date-fns';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date) => {
    return formatDistanceToNow(parseISO(date), { addSuffix: true });
};
