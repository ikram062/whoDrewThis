import { User } from "@prisma/client";
import { Payload } from "./types";
import jwt from "jsonwebtoken";

export const generateToken = (user: User) => {
  const payload: Payload = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "7d",
    }
  );

  return { accessToken, refreshToken };
};
