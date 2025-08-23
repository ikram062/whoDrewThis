import { requireAuth } from "../middleware/requireAuth.middleware";
import {
  getCurrentUserController,
  loginController,
  refreshTokenController,
  registerController,
} from "../controllers/auth.controller";
import { validateRequest } from "../middleware/validateRequest.middleware";
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
} from "../schemas/auth.schema";
import { Router } from "express";

const authRouter = Router();

authRouter.post(
  "/register",
  validateRequest(registerSchema),
  registerController
);
authRouter.post("/login", validateRequest(loginSchema), loginController);
authRouter.post(
  "/refreshtoken",
  validateRequest(refreshTokenSchema),
  refreshTokenController
);
authRouter.get("/", requireAuth, getCurrentUserController);

export default authRouter;
