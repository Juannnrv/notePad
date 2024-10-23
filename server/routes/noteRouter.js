const express = require("express");
const { getNotes, getNoteById, searchNotes, getNoteHistory, createNote, createNoteHistory, updateNote, deleteNote } = require("../controllers/noteController");
const noteValidator = require("../validators/noteValidator");
const { versioning } = require("../middleware/versioning");
const notes = express.Router();

notes.get('/', versioning('1.0.0'), getNotes);
notes.get('/search', versioning('1.0.0'), searchNotes);
notes.get('/:id', versioning('1.0.0'), getNoteById);
notes.get('/:id/history', versioning('1.0.0'), getNoteHistory);
notes.post('/', versioning('1.0.0'), noteValidator.createNote, createNote); 
notes.post('/:id/history', versioning('1.0.0'), noteValidator.createNote, createNoteHistory);
notes.put('/:id', versioning('1.0.0'), noteValidator.updateNote, updateNote);
notes.delete('/:id', versioning('1.0.0'), deleteNote);

module.exports = notes;