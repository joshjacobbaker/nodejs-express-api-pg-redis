const { Sequelize } = require("sequelize");
require("dotenv").config();

// Environment Variables
const {
    DATABASE_NAME,
    DATABASE_USER,
    DATABASE_PASSWORD,
    DATABASE_HOST,
    DATABASE_DIALECT
} = process.env;

const sequelize = new Sequelize(DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, {
    host: DATABASE_HOST,
    dialect: DATABASE_DIALECT
});

sequelize.authenticate()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch(err => console.error("DB Connection Error:", err));
