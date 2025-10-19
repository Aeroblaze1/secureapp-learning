require("dotenv").config(); // <- load .env variables
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";
const SECRET = process.env.JWT_SECRET || "mysecret";

// Allow frontend on localhost:3000
app.use(cors({ origin: "http://localhost:3000" }));

// Temporary route to generate JWT
app.get("/get-token", (req, res) => {
  const token = jwt.sign({ user: "test", role: "admin" }, SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
});

// JWT verification middleware
app.use((req, res, next) => {
  if (req.path === "/get-token") return next(); // skip JWT for token route
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("Missing token");
  try {
    jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(403).send("Invalid token");
  }
});

// Proxy /api/data → backend /data
app.use(
  "/api",
  createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true,
    pathRewrite: { "^/api": "/data" }, // frontend calls /api/data
  })
);

app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
