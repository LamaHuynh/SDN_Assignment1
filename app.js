const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies

const {
  getAllArticles,
  getArticleById,
  addArticle,
  updateArticle,
  deleteArticle,
} = require("./routes/articleRouter");

const {
  getAllComments,
  getCommentById,
  addComment,
  updateComment,
  deleteComment,
} = require("./routes/commentRouter");

//GET all articles
app.get("/articles", getAllArticles);
//GET article by id
app.get("/articles/:id", getArticleById);
//POST new article
app.post("/articles", addArticle);
//PUT update article by id
app.put("/articles/:id", updateArticle);
//DELETE an article
app.delete("/articles/:id", deleteArticle);
//GET all comments
app.get("/comments", getAllComments);
//GET comment by id
app.get("/comments/:id", getCommentById);
//POST new comment
app.post("/comments", addComment);
//PUT update comment by id
app.put("/comments/:id", updateComment);
//DELETE a comment
app.delete("/comments/:id", deleteComment);
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
