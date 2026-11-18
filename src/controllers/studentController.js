const Student = require('../models/student');

module.exports = {
  async create(req, res) {
    try {
      const { name, email, grade, registration } = req.body;
      if (!name || !email) {
        return res.status(400).json({ error: 'Nome e e-mail são obrigatórios.' });
      }

      const newStudent = await Student.create({
        name,
        email,
        grade: grade || 'Ensino Médio',
        registration: registration || `ALU-${Date.now().toString().slice(-4)}`,
      });

      return res.status(201).json(newStudent);
    } catch (error) {
      console.error('Error creating student:', error);
      return res.status(500).json({ error: 'Falha ao cadastrar aluno.' });
    }
  },

  async read(req, res) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 5;
      const offset = (page - 1) * limit;

      const { count, rows } = await Student.findAndCountAll({
        limit,
        offset,
        order: [['id', 'DESC']],
      });

      return res.status(200).json({
        data: rows,
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit) || 1,
      });
    } catch (error) {
      console.error('Error fetching students:', error);
      return res.status(500).json({ error: 'Erro ao listar alunos.' });
    }
  },

  async readById(req, res) {
    try {
      const { id } = req.params;
      const student = await Student.findByPk(id);

      if (!student) {
        return res.status(404).json({ error: 'Aluno não encontrado.' });
      }

      return res.status(200).json(student);
    } catch (error) {
      console.error('Error fetching student by id:', error);
      return res.status(500).json({ error: 'Falha ao buscar dados do aluno.' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const student = await Student.findByPk(id);

      if (!student) {
        return res.status(404).json({ error: 'Aluno não encontrado.' });
      }

      await student.update(req.body);
      return res.status(200).json(student);
    } catch (error) {
      console.error('Error updating student:', error);
      return res.status(500).json({ error: 'Falha ao atualizar dados do aluno.' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const student = await Student.findByPk(id);

      if (!student) {
        return res.status(404).json({ error: 'Aluno não encontrado.' });
      }

      await student.destroy();
      return res.status(200).json({ message: 'Aluno excluído com sucesso.' });
    } catch (error) {
      console.error('Error deleting student:', error);
      return res.status(500).json({ error: 'Falha ao excluir aluno.' });
    }
  },
};
