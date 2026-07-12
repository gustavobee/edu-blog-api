const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:local_password@localhost:5433/edu_blog_db')

async function testConnection() {
    try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    } catch (error) {
    console.error('Unable to connect to the database:', error);
    }
}

testConnection();