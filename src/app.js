const express = require('express');
const sequelize = require('./config/database');

const Post = require('./models/post'); 

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API do Blog Educacional rodando perfeitamente!');
});

sequelize.sync().then(() => {
  console.log('Tabelas do banco de dados sincronizadas com sucesso!');
  
  app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
  });
}).catch(error => {
  console.error('Erro ao sincronizar o banco de dados:', error);
});