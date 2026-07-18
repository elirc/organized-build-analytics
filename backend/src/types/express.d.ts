import type { Role } from "@prisma/client";

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role: Role;
    }

    interface Request {
      user?: User;
      requestId?: string;
    }
  }
}

export {};
