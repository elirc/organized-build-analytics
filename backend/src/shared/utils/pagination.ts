export function getPagination(input?: { page?: number; pageSize?: number }) {
  const page = Math.max(1, input?.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, input?.pageSize ?? 25));
  const skip = (page - 1) * pageSize;

  return { page, pageSize, skip, take: pageSize };
}
