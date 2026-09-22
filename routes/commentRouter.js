const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

//GET All comments at /comments
const getAllComments = async (req, res) => {
  try {
    const data = await fs.promises.readFile(
      path.join(__dirname, "..", "data.json"),
      "utf8",
    );
    const comments = JSON.parse(data).comments;
    res.json(comments);
  } catch (error) {
    res.status(500).send("Error reading data file");
  }
};

//GET comment by Id at /comments/:id
const getCommentById = async (req, res) => {
  const commentId = req.params.id;
  try {
    const data = await fs.promises.readFile(
      path.join(__dirname, "..", "data.json"),
      "utf8",
    );
    const comments = JSON.parse(data).comments;
    const comment = comments.find((a) => String(a.id) === String(commentId));
    if (comment) {
      res.json(comment);
    } else {
      res.status(404).send("Comment not found");
    }
  } catch (error) {
    res.status(500).send("Error reading data file");
  }
};

//POST new comment at /comments
const addComment = async (req, res) => {
  try {
    const data = await fs.promises.readFile(
      path.join(__dirname, "..", "data.json"),
      "utf8",
    );
    const comments = JSON.parse(data).comments;
    const newId =
      comments.reduce(
        (maxId, comment) => Math.max(maxId, Number(comment.id) || 0),
        0,
      ) + 1;
    const { id: _ignoredId, ...commentData } = req.body;
    const newComment = { id: newId, ...commentData };
    comments.push(newComment);
    await fs.promises.writeFile(
      path.join(__dirname, "..", "data.json"),
      JSON.stringify({ comments }, null, 2),
    );
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).send("Error writing data file");
  }
};

//PUT a comment at /comments/:id
const updateComment = async (req, res) => {
  const commentId = req.params.id;
  const updatedData = req.body;
  try {
    const data = await fs.promises.readFile(
      path.join(__dirname, "..", "data.json"),
      "utf8",
    );
    const comments = JSON.parse(data).comments;
    const commentIndex = comments.findIndex(
      (c) => String(c.id) === String(commentId),
    );

    if (commentIndex === -1) {
      return res.status(404).send("Comment not found");
    }

    comments[commentIndex] = { ...comments[commentIndex], ...updatedData };
    await fs.promises.writeFile(
      path.join(__dirname, "..", "data.json"),
      JSON.stringify({ comments }, null, 2),
    );
    res.json(comments[commentIndex]);
  } catch (error) {
    res.status(500).send("Error updating comment");
  }
};

//DELETE a comment at /comments/:id
const deleteComment = async (req, res) => {
  const commentId = req.params.id;
  try {
    const data = await fs.promises.readFile(
      path.join(__dirname, "..", "data.json"),
      "utf8",
    );
    const comments = JSON.parse(data).comments;
    const commentIndex = comments.findIndex(
      (c) => String(c.id) === String(commentId),
    );
    if (commentIndex === -1) {
      return res.status(404).send("Comment not found");
    }
    comments.splice(commentIndex, 1);
    await fs.promises.writeFile(
      path.join(__dirname, "..", "data.json"),
      JSON.stringify({ comments }, null, 2),
    );
    res.status(204).send();
  } catch (error) {
    res.status(500).send("Error deleting comment");
  }
};

module.exports = {
  getAllComments,
  getCommentById,
  addComment,
  updateComment,
  deleteComment,
};
