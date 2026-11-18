const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas para Alunos (Listagem, Cadastro, Edição e Exclusão)
router.get('/alunos', studentController.read);
router.get('/alunos/:id', studentController.readById);
router.post('/alunos', authMiddleware, studentController.create);
router.put('/alunos/:id', authMiddleware, studentController.update);
router.delete('/alunos/:id', authMiddleware, studentController.delete);

// Aliases em inglês para flexibilidade
router.get('/students', studentController.read);
router.get('/students/:id', studentController.readById);
router.post('/students', authMiddleware, studentController.create);
router.put('/students/:id', authMiddleware, studentController.update);
router.delete('/students/:id', authMiddleware, studentController.delete);

module.exports = router;
