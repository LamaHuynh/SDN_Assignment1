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

// GET /comments
const getAllComments = async (req, res) => {
  try {
    const data = await readDataFile();
    res.json(data.comments || []);
  } catch (error) {
    console.error("Error reading file:", error.message);
    res.status(500).json({ error: "Failed to read data" });
  }
};

// GET /comments/:id
const getCommentById = async (req, res) => {
  const commentId = req.params.id;

  try {
    const data = await readDataFile();
    const comments = data.comments || [];

    const comment = comments.find((c) => String(c.id) === String(commentId));

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.json(comment);
  } catch (error) {
    console.error("Error reading file:", error.message);
    res.status(500).json({ error: "Failed to read data" });
  }
};

//POST /comments
const addComment = async (req, res) => {
  try {
    const data = await readDataFile();
    const comments = data.comments || [];

    const maxId = comments.reduce(
      (max, c) => Math.max(max, Number(c.id) || 0),
      0,
    );
    const newId = maxId + 1;

    const { id: _ignored, ...commentData } = req.body;
    const newComment = { id: newId, ...commentData };

    comments.push(newComment);

    data.comments = comments;

    await writeDataFile(data);

    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error adding comment:", error.message);
    res.status(500).json({ error: "Failed to add comment" });
  }
};

//PUT /comments/:id
const updateComment = async (req, res) => {
  const commentId = req.params.id;

  try {
    const data = await readDataFile();
    const comments = data.comments || [];

    const index = comments.findIndex((c) => String(c.id) === String(commentId));

    if (index === -1) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const { id: _ignored, ...updateFields } = req.body;
    comments[index] = { ...comments[index], ...updateFields };

    data.comments = comments;
    await writeDataFile(data);

    res.json(comments[index]);
  } catch (error) {
    console.error("Error updating comment:", error.message);
    res.status(500).json({ error: "Failed to update comment" });
  }
};

//DELETE /comments/:id
const deleteComment = async (req, res) => {
  const commentId = req.params.id;

  try {
    const data = await readDataFile();
    const comments = data.comments || [];

    const index = comments.findIndex((c) => String(c.id) === String(commentId));

    if (index === -1) {
      return res.status(404).json({ error: "Comment not found" });
    }

    comments.splice(index, 1);

    data.comments = comments;
    await writeDataFile(data);

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting comment:", error.message);
    res.status(500).json({ error: "Failed to delete comment" });
  }
};

module.exports = {
  getAllComments,
  getCommentById,
  addComment,
  updateComment,
  deleteComment,
};
