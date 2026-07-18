const UNIT_TO_MS: Record<string, number> = {
  ms: 1,
  s: 1000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000
};

export function parseDurationToMs(input: string) {
  const match = input.trim().match(/^(\d+)(ms|s|m|h|d)$/);

  if (!match) {
    throw new Error(`Unsupported duration format: ${input}`);
  }

  const rawAmount = match[1]!;
  const unit = match[2] as keyof typeof UNIT_TO_MS;
  return Number(rawAmount) * (UNIT_TO_MS[unit] ?? 0);
}
