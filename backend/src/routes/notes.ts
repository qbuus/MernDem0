import express from "express";
import * as NotesController from "../controllers/routes";

const router = express.Router();

router.get("/", NotesController.getNotes);
router.get("/:noteId", NotesController.getNote);
router.post("/", NotesController.createNotes);

export default router;
