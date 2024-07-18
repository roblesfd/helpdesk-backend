const Tag = require("../models/Tag");

// @desc Crea un tag
// @route POST /tags
// @access Private
const createTag = async (req, res) => {
  const { name } = req.body;

  const duplicatedTag = await Tag.findOne({ name })
    .collation({ locale: "es", strength: 2 })
    .lean();

  if (duplicatedTag) {
    res.status(201).json({ tag: duplicatedTag._id });
  }

  try {
    if (!name) {
      return res.status(400).json({ message: "Nombre de etiqueta requerido" });
    }

    const tag = await Tag.create({ name });

    if (tag) {
      res.status(201).json({ tag: tag._id });
    } else {
      res.status(400).json({ message: "Error al crear etiqueta" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};
// @desc Obtiene todos los tags
// @route GET /tags/
// @access Private
const getTags = async (req, res) => {
  try {
    const tags = await Tag.find();

    if (tags) {
      res.status(201).json(tags);
    } else {
      res.status(400).json({ message: "Error al obtener etiquetas" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc Elimina un tag por su id
// @route DELETE /tags/:id
// @access Private
const deleteTag = async (req, res) => {
  const { id } = req.params;
  try {
    const tag = await Tag.findById(id).exec();

    if (!tag) {
      res.status(400).json({ message: "Etiqueta no encontrada" });
    }

    const deletedTag = await Tag.deleteOne();
    const reply = `Etiqueta ${Tag.name} eliminado exitosamente`;
    res.json(reply);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createTag, getTags, deleteTag };
