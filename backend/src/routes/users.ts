import express from "express";
import * as userController from "../controllers/users";

const router = express.Router();

router.post("/signup", userController.singUp);

export default router;
