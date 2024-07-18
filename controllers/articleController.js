const User = require("../models/User");
const Ticket = require("../models/Ticket");
const Notification = require("../models/Notification");
const Comment = require("../models/Comment");

const Article = require("../models/Article");
const Category = require("../models/Category");

// @desc Obtiene todos los articulos
// @route GET /articles
// @access Private
const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find()
      .populate("author")
      .populate("category")
      .exec();

    if (!articles?.length) {
      return res.status(400).json({ message: "No hay artículos" });
    }

    return res.json(articles);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc Crea un ticket
// @route POST /articles
// @access Private
const createArticle = async (req, res) => {
  const { title, category, tags, author, content } = req.body;

  try {
    if (
      !title ||
      !content ||
      !category ||
      !author ||
      !Array.isArray(tags) ||
      !tags?.length
    ) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const articleObject = {
      title,
      content,
      category,
      tags,
      author,
    };

    const createdArticle = await Article.create(articleObject);

    if (createdArticle) {
      return res.status(201).json({ message: "Articulo creado exitosamente" });
    } else {
      return res.status(400).json({ message: "Error al crear artículo" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc Obtiene un articulo por su id
// @route GET /articles/:id
// @access Private
const getArticle = async (req, res) => {
  const { id } = req.params;

  try {
    const article = await Article.findById(id)
      .populate("author")
      .populate("category")
      .populate("tags")
      .exec();
    if (article) {
      return res.json(article);
    } else {
      return res.status(400).json({ message: "Artículo no encontrado" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc Obtiene articulos por contenido de title o content
// @route GET /articles/search
// @access Private
const searchArticles = async (req, res) => {
  const { query, tags } = req.query;

  try {
    if (!query && !tags) {
      return res
        .status(400)
        .json({ message: "Se requiere un término de búsqueda. o Etiqueta" });
    }

    const searchConditions = [];
    if (query) {
      searchConditions.push(
        { title: new RegExp(query, "i") },
        { content: new RegExp(query, "i") }
      );
    }

    if (tags) {
      const tagsArray = tags.split(",").map((tag) => tag.trim());
      searchConditions.push({ tags: { $in: tagsArray } });
    }

    const articles = await Article.find({
      $or: searchConditions,
    })
      .populate("author")
      .exec();

    res.status(200).json(articles);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error al realizar la búsqueda." });
  }
};

// @desc Modifica un articulo
// @route PATCH /articles/:id
// @access Private
const updateArticle = async (req, res) => {
  const { id } = req.params;
  const { title, content, category, tags, author } = req.body;

  try {
    if (!title || !content || !category || !author) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const article = await Article.findById(id).exec();

    if (!article)
      return res.status(400).json({ message: "No se encontro el artículo" });

    article.title = title;
    article.content = content;
    article.category = category;
    article.tags = tags;
    article.author = author;
    article.updatedAt = Date.now();

    const updatedArticle = await article.save();

    if (updatedArticle) {
      return res
        .status(200)
        .json({ message: "Artículo actualizado exitosamente" });
    } else {
      return res.status(400).json({ message: "Error al actualizar artículo" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc Elimina un articulo
// @route DELETE /articles/:id
// @access Private
const deleteArticle = async (req, res) => {
  const { id } = req.params;

  try {
    const article = await Article.findById(id).exec();

    if (!article) {
      res.status(400).json({ message: "Artículo no encontrado" });
    }

    const deletedArticle = await article.deleteOne();
    const reply = `Artículo ${article.title} con ID ${article._id} eliminado exitosamente`;

    res.json({ message: reply });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllArticles,
  createArticle,
  getArticle,
  searchArticles,
  updateArticle,
  deleteArticle,
};
