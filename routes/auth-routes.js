import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import { jwtTokens } from '../utils/jwt-helpers.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await pool.query('SELECT * FROM users WHERE user_email = $1', [email]);
    if (users.rows.length === 0) return res.status(401).json("Email is incorrect");
    //PASSWORD CHECK
    const validPassword = await bcrypt.compare(password, users.rows[0].user_password);
    if (!validPassword) return res.status(401).json("Incorrect password");
    //JWT
    let tokens = jwtTokens(users.rows[0]);//Gets access and refresh tokens
    res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true });
    return res.json(tokens);
  } catch (error) {
    return res.status(401).json(error.message);
  }

});

router.get('/refresh_token', (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (refreshToken === null) return res.sendStatus(401);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      let tokens = jwtTokens(user);
      res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true });
      return res.json(tokens);
    });
  } catch (error) {
    return res.status(401).json(error.message);
  }
});

router.delete('/refresh_token', (req, res) => {
  try {
    res.clearCookie('refresh_token');
    return res.sendStatus(204);
  } catch (error) {
    return res.status(401).json(error.message);
  }
});

export default router;