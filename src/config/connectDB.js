const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('nguyenhai', 'root', null, {
    host: process.env.HOST,
    dialect: 'mysql',
    port: process.env.PORT_DB || 3307,
    logging: false
});

let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports =  connectDB;