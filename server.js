// Sync Models and Start Server
require('dotenv').config();
const express = require("express");
const { sequelize } = require("./models");
const User = require("./models/user.model");
const userRoutes = require("./routes/user.routes");

const SERVER_PORT = process.env.SERVER_PORT || 3000;

const app = express();
app.use(express.json());
app.use("/users", userRoutes);

// Sync database before starting server
sequelize.sync({ force: false }).then(() => {
    console.log("Database synced!");
    app.listen(SERVER_PORT, () => console.log(`Server running on port ${SERVER_PORT}`));
});
