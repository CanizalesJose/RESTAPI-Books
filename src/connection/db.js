var { Sequelize } = require('sequelize')
var sequelize = new Sequelize('printondemand', 'root', '1234', {
    host: 'localhost',
    dialect : 'mysql',
    logging : 'false'
});

var connection = async() =>{
    try{
        await sequelize.authenticate();
        console.log('Connection to DB established');
    } catch(err){
        console.log('Connection to DB failed');
        process.exit(1);
    }
};

module.exports = {sequelize, connection};