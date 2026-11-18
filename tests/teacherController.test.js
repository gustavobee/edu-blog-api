const TeacherController = require('../src/controllers/teacherController');
const Teacher = require('../src/models/teacher');

jest.mock('../src/models/teacher');

describe('TeacherController Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('deve cadastrar um novo professor com sucesso', async () => {
      req.body = { name: 'Prof. Carlos', email: 'carlos@escola.com', subject: 'Matemática' };
      const mockTeacher = { id: 1, ...req.body, registration: 'DOC-1234' };
      Teacher.create.mockResolvedValue(mockTeacher);

      await TeacherController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockTeacher);
    });

    it('deve retornar erro 400 se nome ou email não forem fornecidos', async () => {
      req.body = { name: '' };

      await TeacherController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Nome e e-mail são obrigatórios.' });
    });
  });

  describe('read() com paginação', () => {
    it('deve listar professores paginados', async () => {
      req.query = { page: '1', limit: '5' };
      Teacher.findAndCountAll.mockResolvedValue({
        count: 10,
        rows: [{ id: 1, name: 'Prof. Carlos' }],
      });

      await TeacherController.read(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          total: 10,
          page: 1,
          limit: 5,
          totalPages: 2,
        })
      );
    });
  });

  describe('update()', () => {
    it('deve atualizar os dados do professor', async () => {
      req.params = { id: '1' };
      req.body = { name: 'Prof. Carlos Atualizado' };
      const mockTeacher = {
        id: 1,
        name: 'Prof. Carlos',
        update: jest.fn().mockResolvedValue(true),
      };
      Teacher.findByPk.mockResolvedValue(mockTeacher);

      await TeacherController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockTeacher.update).toHaveBeenCalledWith(req.body);
    });

    it('deve retornar 404 se professor não existir', async () => {
      req.params = { id: '999' };
      Teacher.findByPk.mockResolvedValue(null);

      await TeacherController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('delete()', () => {
    it('deve deletar um professor existente', async () => {
      req.params = { id: '1' };
      const mockTeacher = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(true),
      };
      Teacher.findByPk.mockResolvedValue(mockTeacher);

      await TeacherController.delete(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockTeacher.destroy).toHaveBeenCalled();
    });
  });
});
