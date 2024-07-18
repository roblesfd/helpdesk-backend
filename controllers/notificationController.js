const Notification = require("../models/Notification");

// @desc Obtiene todas las notificaciones
// @route GET /notificaciones
// @access Private
const getAllNotifications = async (req, res) => {
  const notifications = await Notification.find().lean();

  try {
    if (!notifications.length)
      return res.status(400).json({ message: "No hay notificaciones" });

    res.json(notifications);
  } catch (error) {
    console.error({ message: error });
    res
      .status(400)
      .json({ message: `Error al obtener notificaciones: ${error.message}` });
  }
};

// @desc Crea un notificación
// @route POST /notificaciones
// @access Private
const createNotification = async (req, res) => {
  const { recipient, content, type } = req.body;

  try {
    if (!recipient || !content || !type) {
      res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const notification = await Notification.create({
      recipient,
      content,
      type,
    });

    if (notification) {
      res.status(201).json({ message: `Notificación creada exitosamente` });
    } else {
      res.status(400).json("Error al crear una notificación");
    }
  } catch (error) {
    console.error({ message: error });
    res
      .status(400)
      .json({ message: `Error al crear una notificación: ${error.message}` });
  }
};

// @desc Obtiene una notificación
// @route GET /notificaciones/:id
// @access Private
const getNotification = async (req, res) => {
  const { id } = req.params;
  const notification = await Notification.findById(id).exec();
  try {
    if (notification) {
      res.json(notification);
    } else {
      res.status(400).json({ message: "Notificación no encontrada" });
    }
  } catch (error) {
    console.error({ message: error });
    res
      .status(400)
      .json({ message: `Error al obtener la notificación: ${error.message}` });
  }
};

// @desc Elimina una notificación
// @route DELETE /notificaciones/:id
// @access Private
const deleteNotification = async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await Notification.findById(id).exec();

    if (!notification) {
      res.status(400).json({ message: "Notificación no encontrada" });
    }

    const deletedNotification = await notification.deleteOne();

    if (deletedNotification) {
      const reply = `Notificación con ID ${notification._id} eliminada exitosamente`;
      res.json(reply);
    } else {
      res.status(400).json({ message: "Error al eliminar la notificación" });
    }
  } catch (error) {
    console.error({ message: error });
    res.status(400).json({
      message: `Error al eliminar la notificación: ${error.message}`,
    });
  }
};

module.exports = {
  getAllNotifications,
  createNotification,
  getNotification,
  deleteNotification,
};
