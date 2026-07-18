import { prisma } from "../../db/prisma.js";
import { getPagination } from "../../shared/utils/pagination.js";

export const auditRepository = {
  async create(data: Parameters<typeof prisma.auditEvent.create>[0]["data"]) {
    return prisma.auditEvent.create({ data });
  },

  async list(filters: {
    startDate: Date;
    endDate: Date;
    action?: string;
    actorId?: string;
    entityType?: string;
    page?: number;
    pageSize?: number;
  }) {
    const pagination = getPagination(filters);

    const where = {
      createdAt: {
        gte: filters.startDate,
        lte: filters.endDate
      },
      action: filters.action,
      actorId: filters.actorId,
      entityType: filters.entityType
    };

    const [items, total] = await Promise.all([
      prisma.auditEvent.findMany({
        where,
        include: {
          actor: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              role: true
            }
          }
        },
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: "desc" }
      }),
      prisma.auditEvent.count({ where })
    ]);

    return {
      items,
      total,
      page: pagination.page,
      pageSize: pagination.pageSize
    };
  },

  async findById(id: string) {
    return prisma.auditEvent.findUnique({
      where: { id },
      include: {
        actor: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true
          }
        }
      }
    });
  }
};
