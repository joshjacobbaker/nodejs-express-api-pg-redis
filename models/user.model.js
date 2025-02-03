// User Table Definition
const { DataTypes } = require("sequelize");
const { sequelize } = require("./index");

const User = sequelize.define("Test_User", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true }
});

module.exports = User;
