require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { initDb } = require("./db");
const authRoutes = require("./authRoutes");
const authMiddleware = require("./authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ status: "OK" }));

app.use("/auth", authRoutes);

app.get("/welcome", authMiddleware, (req, res) => {
  res.json({ message: `Welcome, ${req.user.email}` });
});

const port = Number(process.env.PORT || 4000);

initDb()
  .then(() => {
    app.listen(port, () => console.log(`Backend running on port ${port}`));
  })
  .catch((err) => {
    console.error("DB init error", err);
    process.exit(1);
  });
