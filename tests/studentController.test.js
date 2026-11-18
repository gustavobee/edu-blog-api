const StudentController = require('../src/controllers/studentController');
const Student = require('../src/models/student');

jest.mock('../src/models/student');

describe('StudentController Unit Tests', () => {
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
    it('deve cadastrar um novo aluno com sucesso', async () => {
      req.body = { name: 'Maria Silva', email: 'maria@aluno.fiap.com.br', grade: '3º Ano EM' };
      const mockStudent = { id: 1, ...req.body, registration: 'ALU-1234' };
      Student.create.mockResolvedValue(mockStudent);

      await StudentController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockStudent);
    });

    it('deve retornar erro 400 se nome ou email não forem informados', async () => {
      req.body = { email: '' };

      await StudentController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Nome e e-mail são obrigatórios.' });
    });
  });

  describe('read() com paginação', () => {
    it('deve listar alunos com paginação', async () => {
      req.query = { page: '1', limit: '5' };
      Student.findAndCountAll.mockResolvedValue({
        count: 8,
        rows: [{ id: 1, name: 'Maria Silva' }],
      });

      await StudentController.read(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          total: 8,
          page: 1,
          limit: 5,
          totalPages: 2,
        })
      );
    });
  });

  describe('update()', () => {
    it('deve atualizar aluno com sucesso', async () => {
      req.params = { id: '1' };
      req.body = { grade: 'Formado' };
      const mockStudent = {
        id: 1,
        name: 'Maria Silva',
        update: jest.fn().mockResolvedValue(true),
      };
      Student.findByPk.mockResolvedValue(mockStudent);

      await StudentController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockStudent.update).toHaveBeenCalledWith(req.body);
    });
  });

  describe('delete()', () => {
    it('deve excluir um aluno com sucesso', async () => {
      req.params = { id: '1' };
      const mockStudent = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(true),
      };
      Student.findByPk.mockResolvedValue(mockStudent);

      await StudentController.delete(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockStudent.destroy).toHaveBeenCalled();
    });
  });
});
