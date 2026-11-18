const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas para Professores (Listagem, Cadastro, Edição e Exclusão)
router.get('/professores', teacherController.read);
router.get('/professores/:id', teacherController.readById);
router.post('/professores', authMiddleware, teacherController.create);
router.put('/professores/:id', authMiddleware, teacherController.update);
router.delete('/professores/:id', authMiddleware, teacherController.delete);

// Aliases em inglês para flexibilidade
router.get('/teachers', teacherController.read);
router.get('/teachers/:id', teacherController.readById);
router.post('/teachers', authMiddleware, teacherController.create);
router.put('/teachers/:id', authMiddleware, teacherController.update);
router.delete('/teachers/:id', authMiddleware, teacherController.delete);

module.exports = router;
