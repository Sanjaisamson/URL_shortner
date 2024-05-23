const { Sequelize, DataTypes } = require("sequelize");

const { sequelize } = require("../utils/database.utils");

const Link = sequelize.define("Links", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: DataTypes.INTEGER,
  url: DataTypes.STRING,
  url_code: DataTypes.STRING,
  clicks: DataTypes.STRING,
  short_url: DataTypes.STRING,
});
Link.sync({ alter: true });
module.exports = { Link };
