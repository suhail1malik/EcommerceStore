// src/utils/format.js
import { formatDistanceToNow, parseISO } from "date-fns";

export const formatCurrencyINR = (value) => {
  if (value == null || Number.isNaN(Number(value))) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(Number(value));
};

// relative time, safe with invalid or missing input
export const relativeTime = (isoOrDate) => {
  if (!isoOrDate) return "N/A";
  try {
    const date =
      typeof isoOrDate === "string" ? parseISO(isoOrDate) : isoOrDate;
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return "N/A";
  }
};

export default { formatCurrencyINR, relativeTime };
