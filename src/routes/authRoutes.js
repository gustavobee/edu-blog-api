const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota de login (Docente ou Aluno)
router.post('/auth/login', authController.login);
router.post('/login', authController.login);

// Rota de verificação de permissão e status
router.get('/auth/verify', authController.verify);
router.get('/auth/status', authController.verify);

module.exports = router;
