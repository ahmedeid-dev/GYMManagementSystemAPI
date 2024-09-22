const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const members = JSON.parse(fs.readFileSync("./members.json"));
const trainers = JSON.parse(fs.readFileSync("./trainers.json"));

app.use(express.json());

// - get all Members
app.get("/members", (req, res) => res.status(200).json(members));

// - get all Members and Member’s Trainer
app.get("/allMembers", (req, res) => {
  let allMembers = [];
  for (let index = 0; index < members.length; index++) {
    const element = members[index];
    for (let i = 0; i < trainers.length; i++) {
      const e = trainers[i];
      if (e.id == element.trainerId) {
        element.trainer = e;
      }
    }
    delete element.trainerId;
    allMembers.push(element);
  }
  res.status(200).json(allMembers);
});

// - get specific Member
app.get("/members/:id", (req, res) => {
  const id = req.params.id;
  const index = members.findIndex((member) => member.id == id);
  if (index == -1) {
    res.status(404).json({ message: "index not found" });
  }
  if (members[index].status == "freezed") {
    res.status(403).json({
      message: "this member is not allowed to enter the gym",
    });
  }
  res.status(200).json(members[index]);
});

// - add Member  (must be unique)

app.post("/members", (req, res) => {
  const index = members.findIndex(
    (member) => member.nationalId == req.body.nationalId
  );
  if (index == -1) {
    // national ID is not Exist
    req.body.id = members.length + 1; //add unique id
    members.push(req.body);
    fs.writeFileSync("./members.json", JSON.stringify(members));
    res.status(201).json({ message: "added Successfully", members });
  } else {
    // National ID is already  Exist
    res.status(403).json({
      message: "this member is already Exist",
      member: members[index],
    });
  }
});
// - Update Member (name, membership, trainer id)
app.put("/members/:id", (req, res) => {
  const id = req.params.id;
  const index = members.findIndex((member) => member.id == id);
  if (index == -1) {
    res.status(404).json({ message: "4 0 4 index not found" });
    return false;
  }
  members[index] = { ...members[index], ...req.body };
  fs.writeFileSync("./members.json", JSON.stringify(members));
  res
    .status(200)
    .json({ message: "updated Successfully", member: members[index] });
});
////////////////////
// - Delete Member (actual delete)
// app.delete("/members/:id", (req, res) => {
//   const id = req.params.id;
//   const index = members.findIndex((member) => member.id == id);
//   if (index == -1) {
//     res.status(404).json({ message: "index not found" });
//     return false;
//   }
//   members.splice(index, 1);
//   fs.writeFileSync("./members.json", JSON.stringify(members));
//   res.status(200).json({ message: "Deleted Successfully", members });
// });

// - Delete Member (soft delete)
app.delete("/members/:id", (req, res) => {
  const id = req.params.id;
  const index = members.findIndex((member) => member.id == id);
  if (index == -1) {
    res.status(404).json({ message: "index not found" });
    return false;
  }
  if (members[index].status == "freezed") {
    res.status(403).json({
      message: "this member is already Deleted"})
  } else {
    members[index].status = "freezed";
    fs.writeFileSync("./members.json", JSON.stringify(members));
    res.status(200).json({ message: "Deleted Successfully", members });
  }
});

////////////////////////////////////

// - Get all trainers
app.get("/trainers", (req, res) => res.json(trainers));

// - add Trainer
app.post("/trainers", (req, res) => {
    req.body.id = trainers.length + 1; //add unique id
    trainers.push(req.body);
    fs.writeFileSync("./trainers.json", JSON.stringify(trainers));
    res.status(201).json({ message: "added Successfully", trainers });
  
});

// - get all Trainers and trainer's Members
app.get("/allTrainers", (req, res) => {
  let allTrainers = [];

  for (let index = 0; index < trainers.length; index++) {
    const element = trainers[index];
    element.members = [];
    for (let i = 0; i < members.length; i++) {
      const e = members[i];
      if (e.trainerId == element.id) {
        element.members.push(e)
      }
    }
    allTrainers.push(element);
  }
  res.status(200).json(allTrainers);
});

// - Update trainer.
app.put("/trainers/:id", (req, res) => {
  const id = req.params.id;
  const index = trainers.findIndex((member) => member.id == id);
  if (index == -1) {
    res.status(404).json({ message: "4 0 4 index not found" });
    return false;
  }
  trainers[index] = { ...trainers[index], ...req.body };
  fs.writeFileSync("./trainers.json", JSON.stringify(trainers));
  res
    .status(200)
    .json({ message: "updated Successfully", member: trainers[index] });
});
// - Delete trainer.
app.delete("/trainers/:id", (req, res) => {
  const id = req.params.id;
  const index = trainers.findIndex((member) => member.id == id);
  if (index == -1) {
    res.status(404).json({ message: "4 0 4 index not found" });
    return false;
  }
  trainers.splice(index, 1);
  fs.writeFileSync("./trainers.json", JSON.stringify(trainers));
  res.status(200).json({ message: "Deleted Successfully", trainers });
});

// 5- Get a specific trainer and trainer’s members
app.get("/allTrainers/:id", (req, res) => {
  let theTrainer=[]
  const id = req.params.id;
  const index = trainers.findIndex((member) => member.id == id);
  if (index == -1) {
    res.status(404).json({ message: "4 0 4 index not found" });
    return false;
  }
  for (let index = 0; index < trainers.length; index++) {
    const element = trainers[index];
    element.members = [];
    for (let i = 0; i < members.length; i++) {
      const e = members[i];
      if (e.trainerId == element.id) {
        element.members.push(e)
      }
    }
    theTrainer.push(element);
  }
  res.status(200).json(theTrainer[index]);
});

// ! //////////////////////////////////////////

// - Get all revenues of all members.
app.get('/allRevenues', (req, res) => {
  let allRevenues = 0;
  for (let index = 0; index < members.length; index++) {
    const element = members[index];
    allRevenues+=element.memberShip.cost
  }
  res.status(200).json({meaasge:`All Revenues Of All Members Are : ${allRevenues} `,allRevenues});
})
// - Get the revenues of a specific trainer.
app.get('/allRevenues/:id', (req, res) => {
  let trainerRevenues = 0;
  const id = req.params.id;
  const index = trainers.findIndex((trainer) => trainer.id == id);
  if (index == -1) {
    res.status(404).json({ message: "index not found" });
  }
  for (let i = 0; i < members.length; i++) {
    const element = members[i];
    if (trainers[index].id == element.trainerId) {
      trainerRevenues += element.memberShip.cost
    }
  }
  res.status(200).json({meaasge:`${trainers[index].name} Revenues Of All Members Are : ${trainerRevenues} `,trainerRevenues});
})
// ? //////////////////////////////////////////

//! 4 0 4 Not Found
app.use("*", (req, res) => {
  res.status(404).send({ message: "route not found" });
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
