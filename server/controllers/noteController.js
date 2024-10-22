// controllers/NoteController.js
const Note = require("../models/noteModel");
const { validationResult } = require("express-validator");

class NoteController {
  /**
   * Gets a list of all notes.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the notes are retrieved.
   */
  static async getNotes(req, res) {
    try {
      const notes = await Note.find();
      res.status(200).json(notes);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving notes", error });
    }
  }

  /**
   * Retrieves a note by its ID.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the note is retrieved.
   * @throws {Error} - If there is an error retrieving the note.
   */
  static async getNoteById(req, res) {
    const { id } = req.params;
    try {
      const note = await Note.findById(id);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.status(200).json(note);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving note", error });
    }
  }

  /**
   * Searches for notes based on the provided query.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the search is complete.
   * @throws {Error} - If there is an error searching for notes.
   */
  static async searchNotes(req, res) {
    const { query } = req.query;

    if (!query || typeof query !== "string") {
      return res
        .status(400)
        .json({ message: "Query parameter is required and must be a string" });
    }

    try {
      const notes = await Note.find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      });
      res.status(200).json(notes);
    } catch (error) {
      res.status(500).json({ message: "Error searching notes", error });
    }
  }

  /**
   * Retrieves the history of changes for a specific note.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the history of changes is retrieved.
   */
  static async getNoteHistory(req, res) {
    const { id } = req.params;
    try {
      const note = await Note.findById(id);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.status(200).json(note.changes); // Devuelve el historial de cambios
    } catch (error) {
      res.status(500).json({ message: "Error retrieving note history", error });
    }
  }

/**
 * Creates a new note.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the note is created.
 */
static async createNote(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, user_id, changes } = req.body;
    try {
        const newNote = new Note({
            title,
            description,
            user_id,
            changes: {
                title,
                description,
                date: new Date()
            }
        });
        await newNote.save();
        res.status(201).json(newNote);
    } catch (error) {
        res.status(500).json({ message: "Error creating note", error });
    }
}

  // Método para crear un cambio en el historial de una nota
  static async createNoteHistory(req, res) {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, date } = req.body;
    try {
      const note = await Note.findById(id);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }

      note.changes.push({ title, description, date });
      await note.save();
      res.status(200).json(note);
    } catch (error) {
      res.status(500).json({ message: "Error creating note history", error });
    }
  }

  // Método para actualizar una nota
  static async updateNote(req, res) {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const updatedNote = await Note.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updatedNote) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.status(200).json(updatedNote);
    } catch (error) {
      res.status(500).json({ message: "Error updating note", error });
    }
  }

  // Método para eliminar una nota
  static async deleteNote(req, res) {
    const { id } = req.params;
    try {
      const deletedNote = await Note.findByIdAndDelete(id);
      if (!deletedNote) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.status(204).send(); // Sin contenido
    } catch (error) {
      res.status(500).json({ message: "Error deleting note", error });
    }
  }
}

module.exports = NoteController;
