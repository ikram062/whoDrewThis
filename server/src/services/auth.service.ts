import prisma from "../db/prisma";
import { generateToken } from "../utils/jwt";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

export const register = async (username: string, email: string, password: string) => {
  const saltRounds = 10;

  const emailExists = await prisma.user.findUnique({
    where: { email },
  });

  if (emailExists) {
    throw new Error("Email already used");
  }

  const usernameExists = await prisma.user.findUnique({
    where: { username },
  });
  
  if (usernameExists) {
    throw new Error("Username already used");
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  const tokens = generateToken(user);

  const { password: _, ...userWithoutPassword } = user;

  return { tokens, user: userWithoutPassword };
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const correctPassowrd = await bcrypt.compare(password, user.password);

  if (!correctPassowrd) {
    throw new Error("Invalid credentials");
  }

  const tokens = generateToken(user);
  const { password: _, ...userWithoutPassword } = user;

  return { tokens, user: userWithoutPassword };
};

export const refreshToken = async (refreshToken: string) => {
  const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as JwtPayload;

  if (!payload) {
    throw new Error("Invalid refresh token");
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const tokens = generateToken(user);
  const { password: _, ...userWithoutPassword } = user;

  return { tokens, user: userWithoutPassword };
};

export const getCurrentUser = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      likedPostIds: true,
      favoritePostIds: true,
      readMessagesId: true,
      conversationsId: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
