const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

// Simple backend route
app.get("/data", (req, res) => {
  res.send("Hello from the backend with token!");
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
