import { prisma } from "../../db/prisma.js";

export const exportsRepository = {
  create(data: Parameters<typeof prisma.exportJob.create>[0]["data"]) {
    return prisma.exportJob.create({ data });
  },

  listByUser(userId: string) {
    return prisma.exportJob.findMany({
      where: { requestedById: userId },
      orderBy: { createdAt: "desc" }
    });
  },

  findById(id: string) {
    return prisma.exportJob.findUnique({
      where: { id }
    });
  },

  update(id: string, data: Parameters<typeof prisma.exportJob.update>[0]["data"]) {
    return prisma.exportJob.update({
      where: { id },
      data
    });
  }
};
