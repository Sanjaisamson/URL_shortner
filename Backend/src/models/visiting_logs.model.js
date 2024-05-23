const { Sequelize, DataTypes } = require("sequelize");

const { sequelize } = require("../utils/database.utils");

const Logs = sequelize.define("visiting_log", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  link_id: DataTypes.INTEGER,
  device_type: DataTypes.STRING,
  device_vendor: DataTypes.STRING,
  device_model: DataTypes.STRING,
  clicked_time: DataTypes.STRING,
  clicked_date: DataTypes.STRING,
});
Logs.sync({ alter: true });
module.exports = { Logs };
