import express from "express";
import { login, logout, refresh } from "../controller/userController.js";

const router = express.Router();

router.post("/login", login);
router.get("/refresh", refresh);
router.get("/logout", logout);

export default router;
