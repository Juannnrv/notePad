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
    const userId = req.auth._id;
    try {
      const notes = await Note.find(
        { user_id: userId, status: "visible" },
        { changes: 0 }
      );
      res.status(200).json({
        status: 200,
        message: "Notes retrieved successfully",
        data: notes,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Error retrieving notes",
      });
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
    const userId = req.auth._id;

    try {
      const note = await Note.findOne(
        { _id: id, user_id: userId },
        { changes: 0 }
      );
      if (!note || note.status === "hidden") {
        return res.status(404).json({
          status: 404,
          message: "Note not found",
        });
      }
      res.status(200).json({
        status: 200,
        message: "Note retrieved successfully",
        data: note,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Error retrieving note",
      });
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
    const userId = req.auth._id;

    if (!query || typeof query !== "string") {
      return res.status(400).json({
        status: 400,
        message: "Query parameter is required and must be a string",
      });
    }

    try {
      const notes = await Note.find(
        {
          $or: [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
          ],
          user_id: userId,
        },
        { changes: 0 }
      );

      if (notes.length === 0 || notes[0].status === "hidden") {
        return res.status(404).json({
          status: 404,
          message: "No notes found",
        });
      }

      res.status(200).json({
        status: 200,
        message: "Notes found successfully",
        data: notes,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Error searching notes",
      });
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
    const userId = req.auth._id;

    try {
      const note = await Note.findOne(
        { _id: id, user_id: userId },
        { changes: 1 }
      );
      if (!note || note.status === "hidden") {
        return res.status(404).json({
          status: 404,
          message: "Note not found",
        });
      }
      res.status(200).json({
        status: 200,
        message: "Note history retrieved successfully",
        data: note.changes,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Error retrieving note history",
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
      return res.status(400).json({
        status: 400,
        message: "Validation errors",
        data: errors.array(),
      });
    }

    const { title, description } = req.body;
    const userId = req.auth._id;
    try {
      const newNote = new Note({
        title,
        description,
        user_id: userId,
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
        data: newNote,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Error creating note",
      });
    }
  }

  /**
   * Creates a change in the history of a note.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the note history is created.
   */
  static async createNoteHistory(req, res) {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        message: "Validation errors",
        data: errors.array(),
      });
    }

    const { title, description } = req.body;
    try {
      const note = await Note.findById(id);
      if (!note) {
        return res.status(404).json({
          status: 404,
          message: "Note not found",
        });
      }

      note.changes.push({ title, description, date: new Date() });
      await note.save();
      res.status(200).json({
        status: 200,
        message: "Note history created successfully",
        data: note,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Error creating note history",
      });
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
    const userId = req.auth._id;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        message: "Validation errors",
        data: errors.array(),
      });
    }

    try {
      const note = await Note.findOne({ _id: id, user_id: userId });
      if (!note) {
        return res.status(404).json({
          status: 404,
          message: "Note not found",
        });
      }

      if (note.status === "hidden") {
        return res.status(404).json({
          status: 404,
          message: "Note already deleted, sorry you cannot edit a deleted note",
        });
      }

      note.changes.push({
        title: note.title,
        description: note.description,
        date: new Date(),
      });

      note.title = req.body.title;
      note.description = req.body.description;

      await note.save();

      res.status(200).json({
        status: 200,
        message: "Note updated successfully",
        data: note,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Error updating note",
      });
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
    const userId = req.auth._id;

    try {
      const note = await Note.findOne({ _id: id, user_id: userId });
      if (!note) {
        return res.status(404).json({
          status: 404,
          message: "Note not found",
        });
      } else if (note.status === "hidden") {
        return res.status(404).json({
          status: 404,
          message: "Note already deleted",
        });
      }

      note.status = "hidden";
      await note.save();

      res.status(200).json({
        status: 200,
        message: "Note deleted successfully",
        data: note,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Error deleting note",
      });
    }
  }
}

module.exports = NoteController;
