const PostController = require('../src/controllers/postController');
const Post = require('../src/models/post');

jest.mock('../src/models/post');

describe('PostController Unit Tests', () => {
  let req, res;

  // Limpando os objetos
  beforeEach(() => {
    req = { params: {}, body: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('It should successfully create a post and return a 201 status.', async () => {
      
      req.body = { title: 'Teste', content: 'Conteúdo de teste' };
      const mockPost = { id: 1, ...req.body };
      
      Post.create.mockResolvedValue(mockPost);

      await PostController.create(req, res);

      expect(Post.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockPost);
    });
  });

  describe('update()', () => {
    it('It should update an existing post and return a 200 status.', async () => {
      req.params = { id: 1 };
      req.body = { title: 'Título Atualizado' };
      
      const mockPost = { 
        id: 1, 
        title: 'Título Antigo',
        update: jest.fn().mockResolvedValue(true) 
      };
      
      Post.findByPk.mockResolvedValue(mockPost);

      await PostController.update(req, res);

      expect(Post.findByPk).toHaveBeenCalledWith(1);
      expect(mockPost.update).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('It should return a 404 error if the post is not found when updating', async () => {
      req.params = { id: 999 };
      Post.findByPk.mockResolvedValue(null);

      await PostController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Post not found' });
    });
  });

  describe('delete()', () => {
    it('It should successfully delete a post and return a 200 status.', async () => {
      req.params = { id: 1 };
      
      const mockPost = { 
        id: 1, 
        destroy: jest.fn().mockResolvedValue(true) 
      };
      
      Post.findByPk.mockResolvedValue(mockPost);

      await PostController.delete(req, res);

      expect(Post.findByPk).toHaveBeenCalledWith(1);
      expect(mockPost.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Post successfully deleted' });
    });
  });
});