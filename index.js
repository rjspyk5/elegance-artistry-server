const cors = require("cors");
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => console.log("server ready"));
app.listen(port, () => console.log("server running"));
