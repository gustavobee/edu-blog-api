const Teacher = require('../models/teacher');

module.exports = {
  async create(req, res) {
    try {
      const { name, email, subject, registration, bio } = req.body;
      if (!name || !email) {
        return res.status(400).json({ error: 'Nome e e-mail são obrigatórios.' });
      }

      const newTeacher = await Teacher.create({
        name,
        email,
        subject: subject || 'Geral',
        registration: registration || `DOC-${Date.now().toString().slice(-4)}`,
        bio: bio || '',
      });

      return res.status(201).json(newTeacher);
    } catch (error) {
      console.error('Error creating teacher:', error);
      return res.status(500).json({ error: 'Falha ao cadastrar professor.' });
    }
  },

  async read(req, res) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 5;
      const offset = (page - 1) * limit;

      const { count, rows } = await Teacher.findAndCountAll({
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
      console.error('Error fetching teachers:', error);
      return res.status(500).json({ error: 'Erro ao listar professores.' });
    }
  },

  async readById(req, res) {
    try {
      const { id } = req.params;
      const teacher = await Teacher.findByPk(id);

      if (!teacher) {
        return res.status(404).json({ error: 'Professor não encontrado.' });
      }

      return res.status(200).json(teacher);
    } catch (error) {
      console.error('Error fetching teacher by id:', error);
      return res.status(500).json({ error: 'Falha ao buscar dados do professor.' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const teacher = await Teacher.findByPk(id);

      if (!teacher) {
        return res.status(404).json({ error: 'Professor não encontrado.' });
      }

      await teacher.update(req.body);
      return res.status(200).json(teacher);
    } catch (error) {
      console.error('Error updating teacher:', error);
      return res.status(500).json({ error: 'Falha ao atualizar dados do professor.' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const teacher = await Teacher.findByPk(id);

      if (!teacher) {
        return res.status(404).json({ error: 'Professor não encontrado.' });
      }

      await teacher.destroy();
      return res.status(200).json({ message: 'Professor excluído com sucesso.' });
    } catch (error) {
      console.error('Error deleting teacher:', error);
      return res.status(500).json({ error: 'Falha ao excluir professor.' });
    }
  },
};
