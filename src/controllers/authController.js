module.exports = {
  async login(req, res) {
    try {
      const { email, password, role } = req.body;

      // Autenticação simulada conforme especificação do Tech Challenge
      const userRole = role === 'Aluno' ? 'Aluno' : 'Professor';
      const userName = email ? email.split('@')[0] : (userRole === 'Professor' ? 'Docente EduBlog' : 'Estudante EduBlog');

      return res.status(200).json({
        message: 'Login realizado com sucesso',
        token: 'simulated_token',
        user: {
          email: email || (userRole === 'Professor' ? 'professor@fiap.com.br' : 'aluno@fiap.com.br'),
          name: userName.charAt(0).toUpperCase() + userName.slice(1),
          role: userRole,
          permissions: {
            canCreatePost: userRole === 'Professor',
            canEditPost: userRole === 'Professor',
            canDeletePost: userRole === 'Professor',
            canManageTeachers: userRole === 'Professor',
            canManageStudents: userRole === 'Professor',
            canComment: true,
          },
        },
      });
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ error: 'Falha no processo de autenticação.' });
    }
  },

  async verify(req, res) {
    const token = req.headers['access_token'];
    if (token === 'simulated_token') {
      return res.status(200).json({
        authenticated: true,
        role: 'Professor',
      });
    }

    return res.status(200).json({
      authenticated: false,
      role: 'Aluno',
    });
  },
};
