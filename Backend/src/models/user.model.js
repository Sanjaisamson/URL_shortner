const { Sequelize, DataTypes } = require("sequelize");

const { sequelize } = require("../utils/database.utils");

const User = sequelize.define("Users", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: DataTypes.STRING,
  mail: DataTypes.STRING,
  password: DataTypes.STRING,
});
User.sync({ alter: true });
module.exports = { User };
