import { prisma } from "../../db/prisma.js";
import { getPagination } from "../../shared/utils/pagination.js";

export const usersService = {
  async list(input: { page?: number; pageSize?: number }) {
    const pagination = getPagination(input);

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true
        }
      }),
      prisma.user.count()
    ]);

    return {
      items,
      page: pagination.page,
      pageSize: pagination.pageSize,
      total
    };
  }
};
