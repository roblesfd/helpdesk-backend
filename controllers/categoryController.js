const Article = require("../models/Article");
const Category = require("../models/Category");

// @desc Crea una categoria
// @route POST /categorias
// @access Private
const createCategory = async (req, res) => {
  const { name } = req.body;

  const duplicatedCategory = await Category.findOne({ name })
    .collation({ locale: "es", strength: 2 })
    .lean();

  if (duplicatedCategory) {
    return res.status(409).json({ message: "Categoría duplicada" });
  }

  try {
    if (!name) {
      return res.status(400).json({ message: "Nombre de categoría requerido" });
    }

    const category = await Category.create({ name });

    if (category) {
      res.status(201).json({ message: "Categoría creada exitosamente" });
    } else {
      res.status(400).json({ message: "Error al crear categoría" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};
// @desc Obtiene todas las categorias
// @route GET /categorias/
// @access Private
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    if (categories) {
      res.status(201).json(categories);
    } else {
      res.status(400).json({ message: "Error al obtener categorías" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc Elimina una categoria por su id
// @route DELETE /categorias/:id
// @access Private
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id).exec();

    if (!category) {
      res.status(400).json({ message: "Categoría no encontrada" });
    }

    const articles = await Article.find({ name: category.name }).exec();

    if (articles) {
      articles.forEach((article) => {
        article.category = null;
        article.save();
      });
    }

    const deletedCategory = await category.deleteOne();
    const reply = `Categoría ${category.name} eliminada exitosamente`;
    res.json(reply);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createCategory, getCategories, deleteCategory };
