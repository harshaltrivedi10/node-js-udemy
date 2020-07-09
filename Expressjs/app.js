const express = require("express");

const app = express();
app.use((req, res, next) => {
  console.log("lalal");
  next();
});

app.use((req, res, next) => {
  console.log("lalal 2");
  //   send response
  res.send("<h1>Hello From Express</h1>");
});
// const server = http.createServer(app);
// server.listen(3000);
app.listen(3000);
