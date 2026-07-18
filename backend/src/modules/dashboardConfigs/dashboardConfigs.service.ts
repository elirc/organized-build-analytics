import { Prisma } from "@prisma/client";

import { prisma } from "../../db/prisma.js";
import { AppError } from "../../shared/errors/AppError.js";
import { ERROR_CODES } from "../../shared/errors/errorCodes.js";

export const dashboardConfigsService = {
  async list() {
    return prisma.dashboardConfig.findMany({
      orderBy: [{ role: "asc" }, { createdAt: "desc" }]
    });
  },

  async create(input: {
    name: string;
    description?: string;
    role: Express.User["role"];
    layoutJson: Record<string, unknown>;
    isDefault?: boolean;
  }) {
    return prisma.dashboardConfig.create({
      data: {
        ...input,
        layoutJson: input.layoutJson as Prisma.InputJsonValue
      }
    });
  },

  async getById(id: string) {
    const item = await prisma.dashboardConfig.findUnique({ where: { id } });

    if (!item) {
      throw new AppError(ERROR_CODES.NOT_FOUND, "Dashboard config not found", 404);
    }

    return item;
  },

  async update(
    id: string,
    input: {
      name?: string;
      description?: string;
      role?: Express.User["role"];
      layoutJson?: Record<string, unknown>;
      isDefault?: boolean;
    }
  ) {
    await this.getById(id);

    return prisma.$transaction(async (transaction) => {
      if (input.isDefault && input.role) {
        await transaction.dashboardConfig.updateMany({
          where: { role: input.role, id: { not: id } },
          data: { isDefault: false }
        });
      }

      return transaction.dashboardConfig.update({
        where: { id },
        data: {
          ...input,
          layoutJson: input.layoutJson as Prisma.InputJsonValue | undefined
        }
      });
    });
  },

  async remove(id: string) {
    await this.getById(id);
    await prisma.dashboardConfig.delete({ where: { id } });
  }
};
