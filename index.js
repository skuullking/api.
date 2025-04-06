const express = require('express');
const User = require('./models/user');
const Score = require('./models/score');
require('dotenv').config();
const app = express();
app.use(express.json());

const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

pool.connect((err) => {
  if (err) {
    console.error('Connection error', err.stack);
  } else {
    console.log('Connected to the database');
  }
});

// Endpoints pour les utilisateurs
app.get('/users', async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.getUserById(req.params.id);
    user ? res.status(200).json(user) : res.status(404).json({ message: 'Utilisateur non trouvé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/users', async (req, res) => {
  try {
    const newUser = await User.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.updateUser(req.params.id, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.patchUser(req.params.id, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    await User.deleteUser(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoints pour les scores
app.get('/scores', async (req, res) => {
  try {
    const scores = await Score.getAllScores();
    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/scores/:id', async (req, res) => {
  try {
    const score = await Score.getScoreById(req.params.id);
    score ? res.status(200).json(score) : res.status(404).json({ message: 'Score non trouvé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/scores', async (req, res) => {
  try {
    const newScore = await Score.createScore(req.body);
    res.status(201).json(newScore);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/scores/:id', async (req, res) => {
  try {
    const updatedScore = await Score.updateScore(req.params.id, req.body);
    res.status(200).json(updatedScore);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/scores/:id', async (req, res) => {
  try {
    const updatedScore = await Score.patchScore(req.params.id, req.body);
    res.status(200).json(updatedScore);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/scores/:id', async (req, res) => {
  try {
    await Score.deleteScore(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
