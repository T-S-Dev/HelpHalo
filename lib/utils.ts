import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-UK", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDuration(createdAt: string | Date, updatedAt: string | Date) {
  const start = new Date(createdAt);
  const end = new Date(updatedAt);
  const diffMs = end.getTime() - start.getTime(); // difference in milliseconds
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);

  if (diffHr > 0) {
    return `${diffHr} hr ${diffMin % 60} min`;
  } else if (diffMin > 0) {
    return `${diffMin} min ${diffSec % 60} sec`;
  } else {
    return `${diffSec} sec`;
  }
}

export const formatDurationFromMs = (ms: number) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};

export function formatMessageTime(timestamp: string | Date) {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
  }).format(date);
}

export function formatTimestamp(timestamp: string | Date) {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date);
}
