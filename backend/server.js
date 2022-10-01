const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { readdirSync } = require("fs");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* Dynamically adding routes localhost:8000/Routes_File_Name */
// Routes
readdirSync("./routes").map((r) => app.use("/", require("./routes/" + r)));

// Database
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch((err) => console.log("Error connection - ", err));

const PORT = process.env.PORT || 8008;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// console.log((new Date() * Math.random()).toString().substring(0, 5));
