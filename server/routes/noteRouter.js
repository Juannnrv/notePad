const express = require("express");
const { getNotes, getNoteById, searchNotes, getNoteHistory, createNote, createNoteHistory, updateNote, deleteNote } = require("../controllers/noteController");
const noteValidator = require("../validators/noteValidator");
const notes = express.Router();

notes.get('/', getNotes);
notes.get('/search', searchNotes);
notes.get('/:id', getNoteById);
notes.get('/:id/history', getNoteHistory);
notes.post('/', noteValidator.createNote, createNote); 
notes.post('/:id/history', noteValidator.createNote, createNoteHistory);
notes.put('/:id', noteValidator.updateNote, updateNote);
notes.delete('/:id', deleteNote);

module.exports = notes;