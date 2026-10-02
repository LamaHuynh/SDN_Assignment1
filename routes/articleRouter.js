const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const DATA_FILE_PATH = path.join(__dirname, "..", "data.json");

const readDataFile = async () => {
  const raw = await fs.promises.readFile(DATA_FILE_PATH, "utf8");
  return JSON.parse(raw);
};

const writeDataFile = async (data) => {
  await fs.promises.writeFile(
    DATA_FILE_PATH,
    JSON.stringify(data, null, 2),
    "utf8",
  );
};

// GET /articles
const getAllArticles = async (req, res) => {
  try {
    const data = await readDataFile();
    res.json(data.articles || []);
  } catch (error) {
    console.error("Error reading file:", error.message);
    res.status(500).json({ error: "Failed to read data" });
  }
};

// GET /articles/:id
const getArticleById = async (req, res) => {
  const articleId = req.params.id;

  try {
    const data = await readDataFile();
    const articles = data.articles || [];

    const article = articles.find((a) => String(a.id) === String(articleId));

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.json(article);
  } catch (error) {
    console.error("Error reading file:", error.message);
    res.status(500).json({ error: "Failed to read data" });
  }
};

// POST /articles
const addArticle = async (req, res) => {
  try {
    const data = await readDataFile();
    const articles = data.articles || [];

    const maxId = articles.reduce(
      (max, a) => Math.max(max, Number(a.id) || 0),
      0,
    );

    const newId = maxId + 1;

    const { id: _ignored, ...articleData } = req.body;
    const newArticle = {
      id: newId,
      ...articleData,
    };

    articles.push(newArticle);

    data.articles = articles;

    await writeDataFile(data);

    res.status(201).json(newArticle);
  } catch (error) {
    console.error("Error adding article:", error.message);
    res.status(500).json({ error: "Failed to add article" });
  }
};

// PUT /articles/:id
const updateArticle = async (req, res) => {
  const articleId = req.params.id;

  try {
    const data = await readDataFile();
    const articles = data.articles || [];

    const index = articles.findIndex((a) => String(a.id) === String(articleId));

    if (index === -1) {
      return res.status(404).json({ error: "Article not found" });
    }

    const { id: _ignored, ...updateFields } = req.body;

    articles[index] = {
      ...articles[index],
      ...updateFields,
    };

    data.articles = articles;

    await writeDataFile(data);

    res.json(articles[index]);
  } catch (error) {
    console.error("Error updating article:", error.message);
    res.status(500).json({ error: "Failed to update article" });
  }
};

// DELETE /articles/:id
const deleteArticle = async (req, res) => {
  const articleId = req.params.id;

  try {
    const data = await readDataFile();
    const articles = data.articles || [];

    const index = articles.findIndex((a) => String(a.id) === String(articleId));

    if (index === -1) {
      return res.status(404).json({ error: "Article not found" });
    }

    articles.splice(index, 1);

    data.articles = articles;

    await writeDataFile(data);

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting article:", error.message);
    res.status(500).json({ error: "Failed to delete article" });
  }
};

module.exports = {
  getAllArticles,
  getArticleById,
  addArticle,
  updateArticle,
  deleteArticle,
};
