const express = require("express");
const router = express.Router();
const Link = require("../model/links");
const { protect } = require("../middleware/authMiddleWare");

router.get("/", protect, async (req, res) => {
  try {
    const links = await Link.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(links);
  } catch (e) {
    res.status(500).send("Server Error");
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const newLink = new Link({
      ...req.body,
      user: req.user.id,
    });
    const savedLink = await newLink.save();
    res.status(201).json(savedLink);
  } catch (e) {
    res.status(500).send("Server Error");
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    let link = await Link.findById(req.params.id);
    if (!link) {
      return res.status(404).json({ msg: "Link not found" });
    }
    if (link.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    const updatedLink = await Link.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedLink);
  } catch (e) {
    res.status(500).send("Server Error");
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    let link = await Link.findById(req.params.id);
    if (!link) {
      return res.status(404).json({ msg: "Link not found" });
    }
    if (link.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    await Link.findByIdAndDelete(req.params.id);
    res.json({ msg: "Link Deleted Successfully" });
  } catch (e) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
