const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/posts', postController.read);
router.get('/posts/search', postController.search);
router.get('/posts/:id', postController.readById);

router.post('/posts', authMiddleware, postController.create);
router.put('/posts/:id', authMiddleware, postController.update);
router.delete('/posts/:id', authMiddleware, postController.delete);

module.exports = router;