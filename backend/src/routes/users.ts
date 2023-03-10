import express from "express";
import * as userController from "../controllers/users";

const router = express.Router();

router.post("/signup", userController.singUp);
router.post("/login", userController.login);
router.get("/", userController.getAuth);
router.post("/logout", userController.logout);

export default router;
