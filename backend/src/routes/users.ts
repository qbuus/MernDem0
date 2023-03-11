import express from "express";
import * as userController from "../controllers/users";
import { requiresAuth } from "../middleware/auth";

const router = express.Router();

router.post("/signup", userController.singUp);
router.post("/login", userController.login);
router.get("/", requiresAuth, userController.getAuth);
router.post("/logout", userController.logout);

export default router;
