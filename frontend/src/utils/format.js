export function formatInr(value) {
  if (value == null) {
    return "Pending";
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatNumber(value, digits = 2) {
  if (value == null) {
    return "Pending";
  }
  return Number(value).toFixed(digits);
}

export function formatArea(value) {
  if (value == null) {
    return "0.000 acres";
  }
  return `${Number(value).toFixed(3)} acres`;
}
