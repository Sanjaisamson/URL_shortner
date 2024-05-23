const { Sequelize, DataTypes } = require("sequelize");

const { sequelize } = require("../utils/database.utils");

const Tokens = sequelize.define("tokens", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: DataTypes.INTEGER,
  refresh_token: DataTypes.STRING,
});
Tokens.sync({ alter: true });
module.exports = { Tokens };
