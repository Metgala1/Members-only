const { body, validationResult } = require("express-validator");
const pool = require("../models/db");

exports.edit_get = async (req, res, next) => {
  const messageId = req.params.id;

  try {
    const result = await pool.query("SELECT * FROM messages WHERE id = $1", [messageId]);
    const message = result.rows[0];

    if (!message) {
      req.flash("error", "Message not found.");
      return res.redirect("/");
    }

    // Only allow the owner to edit
    if (message.user_id !== req.user.id) {
      req.flash("error", "You are not authorized to edit this message.");
      return res.redirect("/");
    }

    res.render("edit-message", { title: "Edit Message", message });
  } catch (err) {
    return next(err);
  }
};

exports.edit_post = [
  body("title").trim().isLength({ min: 1 }).withMessage("Title is required").escape(),
  body("content").trim().isLength({ min: 1 }).withMessage("Content is required").escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    const messageId = req.params.id;

    if (!errors.isEmpty()) {
      return res.render("edit-message", {
        title: "Edit Message",
        message: { id: messageId, ...req.body },
        errors: errors.array(),
      });
    }

    try {
      const result = await pool.query("SELECT * FROM messages WHERE id = $1", [messageId]);
      const message = result.rows[0];

      if (!message || message.user_id !== req.user.id) {
        req.flash("error", "Unauthorized.");
        return res.redirect("/");
      }

      await pool.query(
        "UPDATE messages SET title = $1, content = $2 WHERE id = $3",
        [req.body.title, req.body.content, messageId]
      );

      req.flash("success", "Message updated.");
      res.redirect("/");
    } catch (err) {
      next(err);
    }
  },
];

exports.delete_post = async (req, res, next) => {
  const messageId = req.params.id;
  const currentUser = req.user;

  try {
    const result = await pool.query("SELECT * FROM messages WHERE id = $1", [messageId]);
    const message = result.rows[0];

    if (!message) {
      req.flash("error", "Message not found.");
      return res.redirect("/");
    }

    if (message.user_id !== currentUser.id) {
      req.flash("error", "You are not authorized to delete this message.");
      return res.redirect("/");
    }

    await pool.query("DELETE FROM messages WHERE id = $1", [messageId]);
    req.flash("success", "Message deleted successfully.");
    res.redirect("/");
  } catch (err) {
    return next(err);
  }
};
