const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const schoolRoutes = require("./routes/school.routes");

app.use("/api", schoolRoutes);

module.exports = app;
