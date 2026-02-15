const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { validationResult } = require('express-validator');

class AuthController {
  static async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { nombre, email, password, telefono } = req.body;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }

      const user = await User.create({
        nombre,
        email,
        password_hash: password,
        telefono
      });

      const token = jwt.sign(
        { id: user.id_usuario, email: user.email, rol: user.rol },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      const userResponse = user.toJSON();
      delete userResponse.password_hash;

      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        user: userResponse,
        token
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const isValidPassword = await user.validPassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const token = jwt.sign(
        { id: user.id_usuario, email: user.email, rol: user.rol },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      const userResponse = user.toJSON();
      delete userResponse.password_hash;

      res.json({
        message: 'Login exitoso',
        user: userResponse,
        token
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async profile(req, res) {
    try {
      const user = await User.findByPk(req.user.id_usuario, {
        attributes: { exclude: ['password_hash'] }
      });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AuthController;