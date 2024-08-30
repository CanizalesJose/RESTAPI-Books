var { Sequelize, DataTypes} = require('sequelize');
var { sequelize } = require('../connection/db')

var Material = sequelize.define('Material', {
    id : {
        type : DataTypes.STRING,
        allowNull : false
    },
    name : {
        type : DataTypes.STRING,
        allowNull : false
    },
    priceModifier : {
        type : DataTypes.FLOAT,
        allowNull : false
    }
});

module.exports = Material;