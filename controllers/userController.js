const User = require("../models/User");
const Ticket = require("../models/Ticket");
const Notification = require("../models/Notification");
const Comment = require("../models/Comment");
const { emailConfirmacion } = require("../middleware/emailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// @desc Obtiene todos los usuarios
// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password").lean();

  if (!users?.length)
    return res.status(400).json({ message: "No hay usuarios" });

  res.json(users);
};

// @desc Crea un usuario
// @route POST /users
// @access Private
const createUser = async (req, res) => {
  const {
    username,
    password,
    email,
    name,
    lastname,
    phoneNumber,
    active,
    roles,
    isClient,
  } = req.body;

  if (!username || !password || !email) {
    res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  const duplicatedUser = await User.findOne({ username })
    .collation({ locale: "es", strength: 2 })
    .lean();

  if (duplicatedUser) {
    return res.status(409).json({ message: "Nombre de usuario duplicado" });
  }

  const duplicatedEmail = await User.findOne({ email: email }).lean().exec();

  if (duplicatedEmail) {
    return res.status(409).json({ message: "Correo electrónico duplicado" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  let token;

  if (isClient) {
    token = crypto.randomBytes(20).toString("hex");
  }

  const user = await User.create({
    username,
    password: hashedPassword,
    email,
    name,
    lastname,
    phoneNumber,
    active,
    roles,
    token,
  });

  if (user) {
    if (isClient) {
      emailConfirmacion({
        nombre: user.username,
        email: user.email,
        token: user.token,
      });
      location.href = "/cuenta-creada";
    }

    return res.status(201).json({ message: `Nuevo usuario: ${username}` });
  } else {
    res.status(400).json("Error al crear un usuario");
  }
};

// @desc Obtiene un usuario
// @route GET /users/:id
// @access Private
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password").exec();
    if (user) {
      res.json(user);
    } else {
      res.status(400).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc Actualiza datos de usuario
// @route PATCH /users/:id
// @access Private
const updateUser = async (req, res) => {
  const {
    idUser,
    username,
    password,
    email,
    name,
    lastname,
    active,
    roles,
    phoneNumber,
  } = req.body;

  let { id } = req.params;

  if (id === "undefined") {
    id = idUser;
  }

  try {
    if (!id || !username || !password || !email) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const user = await User.findById(id).exec();

    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const duplicate = await User.findOne({ username })
      .collation({ locale: "es", strength: 2 })
      .lean()
      .exec();

    if (duplicate && duplicate?._id.toString() !== id) {
      return res.status(409).json({ message: "Usuario duplicado" });
    }

    if (name) user.name = name;
    if (lastname) user.lastname = lastname;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    user.active = active;
    user.username = username;
    user.email = email;
    user.roles = roles;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    const userUpdated = await user.save();

    res.json({ message: `Usuario ${userUpdated.username} actualizado` });
  } catch (error) {
    console.error(error.message);
    res
      .status(400)
      .json({ message: `Error al actualizar el usuario ${error.message}` });
  }
};

// @desc Elimina un usuario
// @route DELETE /users/:id
// @access Private
const deleteUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id).exec();

  if (!user) {
    res.status(400).json({ message: "Usuario no encontrado" });
  }

  const ticket = await Ticket.findOne({ createdBy: id }).lean().exec();

  if (ticket) {
    return res
      .status(400)
      .json({ message: "El usuario tiene tickets asignados" });
  }

  const notifications = await Notification.find({ recipient: id }).exec();

  if (notifications) {
    const deletedNotifications = await Notification.deleteMany({
      recipient: id,
    });
  }

  const comments = Comment.find({ recipient: id }).exec();

  if (comments) {
    const deletedCommnents = await Comment.deleteMany({ userId: id });
  }

  const deletedUser = await user.deleteOne();
  const reply = `Usuario ${user.username} con ID ${user._id} eliminado exitosamente`;

  res.json(reply);
};

module.exports = { getAllUsers, createUser, getUser, updateUser, deleteUser };
