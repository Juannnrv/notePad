const express = require("express");
const { getNotes, getNoteById, searchNotes, getNoteHistory, createNote, createNoteHistory, updateNote, deleteNote } = require("../controllers/noteController");
const noteValidator = require("../validators/noteValidator");
const { versioning } = require("../middleware/versioning");
const { limit } = require("../middleware/requestLimit");
const notes = express.Router();

notes.get('/', limit('get', '/'), versioning('1.0.0'), getNotes);
notes.get('/search', limit('get', '/search'), versioning('1.0.0'), searchNotes);
notes.get('/:id', limit('get', '/:id'), versioning('1.0.0'), getNoteById);
notes.get('/:id/history', limit('get', '/:id/history'), versioning('1.0.0'), getNoteHistory);
notes.post('/', limit('post', '/'), versioning('1.0.0'), noteValidator.createNote, createNote); 
notes.post('/:id/history', limit('post', '/:id/history'), versioning('1.0.0'), noteValidator.createNote, createNoteHistory);
notes.put('/:id', limit('put', '/:id'), versioning('1.0.0'), noteValidator.updateNote, updateNote);
notes.delete('/:id', limit('delete', '/:id'), versioning('1.0.0'), deleteNote);

module.exports = notes;