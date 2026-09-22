const fs = require("fs");
const path = require("path");

const dataFile = path.join(__dirname, "..", "data.json");

async function readData() {
  const file = await fs.promises.readFile(dataFile, "utf8");
  return JSON.parse(file);
}

async function saveData(data) {
  await fs.promises.writeFile(dataFile, JSON.stringify(data, null, 2));
}

//GET All articles at /articles
const getAllArticles = async (req, res) => {
  try {
    const data = await readData();
    res.json(data.articles);
  } catch (error) {
    res.status(500).send("Error reading data file");
  }
};

//GET Article by ID at /articles/:id
const getArticleById = async (req, res) => {
  try {
    const data = await readData();
    const article = data.articles.find((item) => item.id == req.params.id);

    if (!article) return res.status(404).send("Article not found");
    res.json(article);
  } catch (error) {
    res.status(500).send("Error reading data file");
  }
};

//POST new article at /articles, new article must have an id appropriate for existing data
const addArticle = async (req, res) => {
  try {
    const data = await readData();
    const lastArticle = data.articles[data.articles.length - 1];
    const newId = lastArticle ? Number(lastArticle.id) + 1 : 1;
    const newArticle = { id: newId, ...req.body };

    delete newArticle.id;
    newArticle.id = newId;
    data.articles.push(newArticle);
    await saveData(data);
    res.status(201).json(newArticle);
  } catch (error) {
    res.status(500).send("Error writing data file");
  }
};

//PUT an article by ID at /articles/:id
const updateArticle = async (req, res) => {
  try {
    const data = await readData();
    const articleIndex = data.articles.findIndex(
      (item) => item.id == req.params.id,
    );
    if (articleIndex === -1) {
      return res.status(404).send("Article not found");
    }
    data.articles[articleIndex] = {
      ...data.articles[articleIndex],
      ...req.body,
      id: data.articles[articleIndex].id,
    };
    await saveData(data);
    res.json(data.articles[articleIndex]);
  } catch (error) {
    res.status(500).send("Error updating article");
  }
};

//DELETE an article at /articles/:id
const deleteArticle = async (req, res) => {
  try {
    const data = await readData();
    const articleIndex = data.articles.findIndex(
      (item) => item.id == req.params.id,
    );
    if (articleIndex === -1) {
      return res.status(404).send("Article not found");
    }
    data.articles.splice(articleIndex, 1);
    await saveData(data);
    res.status(204).send();
  } catch (error) {
    res.status(500).send("Error deleting article");
  }
};

module.exports = {
  getAllArticles,
  getArticleById,
  addArticle,
  updateArticle,
  deleteArticle,
};
