export function formatNumber(n: number): string {
  // Force a stable, locale-independent grouping (US style) to avoid SSR/CSR mismatch
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);
}

export function formatSAR(n: number): string {
  return `SAR ${formatNumber(n)}`;
}




