export function formatPercent(value: number) {
  return `${(value * 100).toFixed(2)}%`;
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat().format(value);
}
