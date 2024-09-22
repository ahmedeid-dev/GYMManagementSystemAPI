const express = require("express");
const app = express();
let users = [{ name: "ahmed", age: 20, id: 1 }];
app.use(express.json());
// get
app.get("/users", (req, res, next) => {
  res.status(200).json({ message: "success", users });
});
// get single
app.get("/users/:id", (req, res, next) => {
  let user = users.find((user) => user.id == req.params.id);
  res.status(200).json({ message: "success", users });
});
// add
app.post("/users", (req, res, next) => {
  req.body.id = users.length + 1;
  users.push(req.body);
  res.status(201).json({ message: "add", users });
});
// update
app.put("/users/:id", (req, res, next) => {
  let index = users.findIndex((user) => user.id == req.params.id);
  users[index] = { ...users[index], ...req.body };
  res.status(200).json({ message: "updated", users });
});
// delete
app.delete("/users", (req, res, next) => {
  let index = users.findIndex((user) => user.id == req.params.id);
  users[index].splice(index, 1);
  res.status(200).json({ message: "deleted", users });
});
//  4 0 4
app.use("*", () => {
  res.status(404).json({ message: "4 0 4 Not Found" });
});
app.listen(3000, () => {
  console.log("server is running ...");
});
