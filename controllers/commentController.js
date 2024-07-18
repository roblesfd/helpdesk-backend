const User = require("../models/User");
const Ticket = require("../models/Ticket");
const Article = require("../models/Article");
const Notification = require("../models/Notification");
const Comment = require("../models/Comment");

// @desc Obtiene todos los comentarios
// @route GET /comentarios
// @access Private
const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find().exec();
    if (!comments?.length) {
      return res.status(400).json({ message: "No hay comentarios" });
    }

    return res.json(comments);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc Crea un ticket
// @route POST /comentarios
// @access Private
const createComment = async (req, res) => {
  const { ticketId, userId, content } = req.body;

  try {
    if (!ticketId || !userId || !content) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const commentObject = { ticketId, userId, content, createdAt: Date.now() };

    const createdComment = await Comment.create(commentObject);

    if (createdComment) {
      return res
        .status(201)
        .json({ message: "Comentario creado exitosamente" });
    } else {
      return res.status(400).json({ message: "Error al crear comentario" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc Obtiene un comentario por su id
// @route GET /comentarios/:id
// @access Private
const getComment = async (req, res) => {
  const { id } = req.params;

  try {
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }

  const comment = await Comment.findById(id).exec();

  if (comment) {
    return res.json(comment);
  } else {
    return res.status(400).json({ message: "Comentario no encontrado" });
  }
};

// @desc Elimina un comentario
// @route DELETE /comentarios/:id
// @access Private
const deleteComment = async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await Comment.findById(id).exec();

    if (!comment) {
      res.status(400).json({ message: "Comentario no encontrado" });
    }

    const deletedComment = await comment.deleteOne();
    const reply = `Comentario con ID ${comment._id} eliminado exitosamente`;

    res.json(reply);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllComments,
  createComment,
  getComment,
  deleteComment,
};
