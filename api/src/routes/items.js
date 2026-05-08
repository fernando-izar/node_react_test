const express = require("express");
const store = require("../data/store");

const router = express.Router();

router.get("/", (_req, res) => res.json(store.getAll()));

router.get("/:id", (req, res) => {
  const item = store.getById(Number(req.params.id));
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

router.post("/", (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: "name is required" });
  res.status(201).json(store.create({ name, description }));
});

router.put("/:id", (req, res) => {
  const item = store.update(Number(req.params.id), req.body);
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

router.delete("/:id", (req, res) => {
  const ok = store.remove(Number(req.params.id));
  if (!ok) return res.status(404).json({ error: "Not found" });
  res.status(204).end();
});

module.exports = router;
