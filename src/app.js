'use strict';

const express = require('express');
const app = express();
app.use(express.json());

// In-memory store
const items = new Map();
let nextId = 1;

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET all items
app.get('/items', (req, res) => {
  res.json(Array.from(items.values()));
});

// GET single item
app.get('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.get(id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
});

// POST create item
app.post('/items', (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'name is required' });
  }
  const item = { id: nextId++, name: name.trim() };
  items.set(item.id, item);
  res.status(201).json(item);
});

// DELETE item
app.delete('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (!items.has(id)) return res.status(404).json({ error: 'Item not found' });
  items.delete(id);
  res.status(204).send();
});

module.exports = app;
