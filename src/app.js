const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const postRoutes = require('./routes/postRoutes'); 
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use(authRoutes);
app.use(postRoutes);
app.use(teacherRoutes);
app.use(studentRoutes);

sequelize.sync().then(() => {
  console.log('Database tables successfully synchronized!');
  
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
}).catch(error => {
  console.error('Error synchronizing the database: ', error);
});