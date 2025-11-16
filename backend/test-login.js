require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectToMongo = require("./database/db");

const app = express();
connectToMongo();

app.use(cors());
app.use(express.json());

// Import faculty route
app.use("/api/faculty", require("./routes/details/faculty-details.route"));

const port = 3001;

app.listen(port, () => {
  console.log(`Test server running on http://localhost:${port}`);
  console.log("Try logging in with:");
  console.log("Email: faculty@gmail.com");
  console.log("Password: faculty123");
});