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
      const notes = await Note.find({ status: "visible" }, { changes: 0 });
      res
        .status(200)
        .json({ status: 200, message: "Notes retrieved successfully", notes });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving notes", error: error.message });
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
      const note = await Note.findById(id, { changes: 0 });
      if (!note || note.status === "hidden") {
        return res.status(404).json({ message: "Note not found" });
      }
      res
        .status(200)
        .json({ status: 200, message: "Note retrieved successfully", note });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving note", error: error.message });
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
      const notes = await Note.find(
        {
          $or: [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
          ],
        },
        { changes: 0 }
      );

      if (notes.length === 0 || notes[0].status === "hidden") {
        return res.status(404).json({ message: "No notes found" });
      }

      res
        .status(200)
        .json({ status: 200, message: "Notes found successfully", notes });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error searching notes", error: error.message });
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
      const note = await Note.findById(id, { changes: 1 });
      if (!note || note.status === "hidden") {
        return res.status(404).json({ message: "Note not found" });
      }
      res.status(200).json({
        status: 200,
        message: "Note history retrieved successfully",
        changes: note.changes,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving note history",
        error: error.message,
      });
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

    const { title, description, user_id } = req.body;
    try {
      const newNote = new Note({
        title,
        description,
        user_id,
        changes: {
          title,
          description,
          date: new Date(),
        },
      });
      await newNote.save();
      res.status(201).json({
        status: 201,
        message: "Note created successfully",
        note: newNote,
      });
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

    const { title, description } = req.body;
    try {
      const note = await Note.findById(id);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }

      note.changes.push({ title, description, date: new Date() });
      await note.save();
      res.status(200).json({
        status: 200,
        message: "Note history created successfully",
        note: note,
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating note history", error });
    }
  }

  /**
   * Updates a note by its ID.
   * @param {Object} req - The request object.
   * @param {Object} req.params - The parameters object containing the note ID.
   * @param {Object} req.body - The updated note data.
   * @param {Object} res - The response object.
   * @returns {Object} - The updated note or an error message.
   */
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

      if (updatedNote.status === "hidden") {
        return res
          .status(404)
          .json({
            message:
              "Note already deleted, sorry you cannot edit a deleted note",
          });
      }

      updatedNote.changes.push({ ...req.body, date: new Date() });
      await updatedNote.save();

      res.status(200).json({
        status: 200,
        message: "Note updated successfully",
        note: updatedNote,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating note", error: error.message });
    }
  }

  /**
   * Deletes a note by updating its status to "hidden".
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} - The response object with status and message.
   * @throws {Error} - If there is an error deleting the note.
   */
  static async deleteNote(req, res) {
    const { id } = req.params;
    try {
      const note = await Note.findById(id);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      } else if (note.status === "hidden") {
        return res.status(404).json({ message: "Note already deleted" });
      }

      note.status = "hidden";
      await note.save();

      res.status(200).json({
        status: 200,
        message: "Note deleted successfully",
        note,
      });
    } catch (error) {
      res.status(500).json({ message: "Error deleting note", error: error.message });
    }
  }
}

module.exports = NoteController;
