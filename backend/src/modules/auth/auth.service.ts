import { Role } from "@prisma/client";

import { prisma } from "../../db/prisma.js";
import { AppError } from "../../shared/errors/AppError.js";
import { ERROR_CODES } from "../../shared/errors/errorCodes.js";
import { sha256 } from "../../shared/utils/hash.js";
import { hashPassword, verifyPassword } from "../../shared/utils/password.js";
import { parseDurationToMs } from "../../shared/utils/duration.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../shared/utils/jwt.js";
import { auditService } from "../audit/audit.service.js";

interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
}

interface LoginInput {
  email: string;
  password: string;
}

export const authService = {
  async register(input: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() }
    });

    if (existingUser) {
      throw new AppError(ERROR_CODES.CONFLICT, "User already exists", 409);
    }

    const passwordHash = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        role: input.role
      }
    });

    await prisma.trackedEvent.create({
      data: {
        eventType: "USER_SIGNED_UP",
        actorId: user.id,
        actorEmail: user.email,
        entityType: "User",
        entityId: user.id,
        metadata: {
          role: user.role
        }
      }
    });

    await auditService.record({
      actorId: user.id,
      action: "USER_CREATED",
      entityType: "User",
      entityId: user.id,
      metadata: {
        role: user.role
      }
    });

    return createSession(user);
  },

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() }
    });

    if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
      await prisma.trackedEvent.create({
        data: {
          eventType: "USER_LOGIN_FAILED",
          actorEmail: input.email.toLowerCase(),
          entityType: "User",
          metadata: {
            source: "auth.login"
          }
        }
      });
      throw new AppError(ERROR_CODES.UNAUTHORIZED, "Invalid email or password", 401);
    }

    if (!user.isActive) {
      throw new AppError(ERROR_CODES.FORBIDDEN, "User account is inactive", 403);
    }

    await prisma.trackedEvent.create({
      data: {
        eventType: "USER_LOGGED_IN",
        actorId: user.id,
        actorEmail: user.email,
        entityType: "User",
        entityId: user.id
      }
    });

    return createSession(user);
  },

  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError(ERROR_CODES.NOT_FOUND, "User not found", 404);
    }

    return sanitizeUser(user);
  },

  async refresh(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);
    const tokenHash = sha256(refreshToken);

    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        userId: payload.sub,
        tokenHash,
        revokedAt: null,
        expiresAt: { gt: new Date() }
      },
      include: {
        user: true
      }
    });

    if (!storedToken) {
      throw new AppError(ERROR_CODES.UNAUTHORIZED, "Refresh token is invalid or expired", 401);
    }

    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() }
    });

    return createSession(storedToken.user);
  },

  async logout(refreshToken: string) {
    const tokenHash = sha256(refreshToken);

    await prisma.refreshToken.updateMany({
      where: {
        tokenHash,
        revokedAt: null
      },
      data: {
        revokedAt: new Date()
      }
    });
  }
};

async function createSession(user: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role
  };
  const refreshToken = signRefreshToken(payload);
  const refreshTokenExpiresAt = new Date(
    Date.now() + parseDurationToMs(process.env.JWT_REFRESH_EXPIRES_IN ?? "7d")
  );

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: sha256(refreshToken),
      expiresAt: refreshTokenExpiresAt
    }
  });

  return {
    user: sanitizeUser(user),
    accessToken: signAccessToken(payload),
    refreshToken
  };
}

function sanitizeUser(user: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}
