const express = require("express");
console.log("Express version:", require("express/package.json").version);

const app = express();
console.log("App type:", typeof app);
console.log("App.listen type:", typeof app.listen);
console.log("App methods:", Object.getOwnPropertyNames(app).slice(0, 10));

app.get("/", (req, res) => {
  res.json({ message: "Test" });
});

if (typeof app.listen === "function") {
  app.listen(3001, () => {
    console.log("Server running on port 3001");
    process.exit(0);
  });
} else {
  console.log("ERROR: app.listen is not a function");
  process.exit(1);
}
