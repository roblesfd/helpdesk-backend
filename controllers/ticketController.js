const User = require("../models/User");
const Ticket = require("../models/Ticket");

// @desc Obtiene todos los tickets
// @route GET /tickets
// @access Private
const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("createdBy")
      .populate("assignedTo")
      .exec();

    if (!tickets?.length) {
      return res.status(400).json({ message: "No hay tickets" });
    }

    return res.json(tickets);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc Crea un ticket
// @route POST /tickets
// @access Private
const createTicket = async (req, res) => {
  const {
    title,
    description,
    status,
    priority,
    assignedTo,
    username,
    isClient,
  } = req.body;
  const ticketCreator = await User.findOne({ username })
    .select("-password")
    .exec();

  try {
    if (!isClient) {
      if (!title || !description || !assignedTo) {
        return res
          .status(400)
          .json({ message: "Todos los campos son obligatorios" });
      }
    } else {
      if (!title || !description) {
        return res
          .status(400)
          .json({ message: "Todos los campos son obligatorios" });
      }
    }

    const ticketObject = {
      title,
      description,
      status,
      priority,
      assignedTo,
      createdBy: ticketCreator._id,
    };

    const createdTicket = await Ticket.create(ticketObject);

    if (createdTicket) {
      return res.status(201).json({ message: "Ticket creado exitosamente" });
    } else {
      return res.status(400).json({ message: "Error al crear Ticket" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Obtiene un ticket por su id
// @route GET /tickets/:id
// @access Private
const getTicket = async (req, res) => {
  const { id } = req.params;
  try {
    const ticket = await Ticket.findById(id)
      .populate("createdBy")
      .populate("assignedTo")
      .exec();

    if (ticket) {
      return res.json(ticket);
    } else {
      return res.status(400).json({ message: "Ticket no encontrado" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc Modifica un ticket
// @route PATCH /tickets/:id
// @access Private
const updateTicket = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority, assignedTo } = req.body;

  try {
    if (!title || !description || !status || !priority || !assignedTo) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const ticket = await Ticket.findById(id).exec();

    if (!ticket)
      return res.status(400).json({ message: "No se encontro el ticket" });

    ticket.title = title;
    ticket.description = description;
    ticket.status = status;
    ticket.priority = priority;
    ticket.assignedTo = assignedTo;
    ticket.updatedAt = Date.now();

    const updatedTicket = await ticket.save();

    if (updatedTicket) {
      return res.status(200).json({ message: "Ticket actualizado" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc Elimina un ticket
// @route DELETE /tickets/:id
// @access Private
const deleteTicket = async (req, res) => {
  const { id } = req.params;

  try {
    const ticket = await Ticket.findById(id).exec();

    if (!ticket) {
      res.status(400).json({ message: "Ticket no encontrado" });
    }

    const deletedTicket = await ticket.deleteOne();
    const reply = `Ticket ${ticket.title} con ID ${ticket._id} eliminado exitosamente`;

    res.json(reply);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllTickets,
  createTicket,
  getTicket,
  updateTicket,
  deleteTicket,
};
