const express = require('express');
const sequelize = require('./config/database');
const postRoutes = require('./routes/postRoutes'); 

const app = express();

app.use(express.json());

app.use(postRoutes);

sequelize.sync().then(() => {
  console.log('Database tables successfully synchronized!');
  
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
}).catch(error => {
  console.error('Error synchronizing the database: ', error);
});