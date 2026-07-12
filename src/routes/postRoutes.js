const express = require('express');
const router = express.Router();
const PostController = require('../controllers/postController');

router.get('/posts', PostController.read);

router.get('/posts/search', PostController.search);

router.get('/posts/:id', PostController.readById);
router.put('/posts/:id', PostController.update);
router.delete('/posts/:id', PostController.delete);

router.post('/posts', PostController.create);

module.exports = router;