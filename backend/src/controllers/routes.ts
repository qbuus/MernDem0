import { RequestHandler } from "express";
import NoteModel from "../models/note";

export const getNotes: RequestHandler = async function (
  req,
  res,
  next
) {
  try {
    const notes = await NoteModel.find().exec();
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

export const getNote: RequestHandler = async function (
  req,
  res,
  next
) {
  try {
    const noteId = req.params.noteId;
    const note = await NoteModel.findById(noteId).exec();
    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const createNotes: RequestHandler = async function (
  req,
  res,
  next
) {
  try {
    const title = req.body.title;
    const text = req.body.title;

    const newNote = await NoteModel.create({
      title: title,
      text: text,
    });
    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};
