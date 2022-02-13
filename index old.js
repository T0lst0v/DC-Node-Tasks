const path = require("path");
const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const hbs = require("hbs");
const indexPath = path.join(__dirname, "public");

// const PORT = process.env.PORT || 8080;
const PORT = process.env.PORT || 3000;

console.log(indexPath);

hbs.registerPartials("./views/partials");

app.set("view engine", "hbs");
app.use(express.static(indexPath));

app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: "keyboard warrior",
    resave: true,
    saveUninitialized: true,
  })
);

const tasksArr = [];

function todayDate() {
  var today = new Date().toJSON().slice(0, 10).replace(/-/g, "-");
  return today;
}

app.post("/login", (req, res) => {
  const username = req.body.username;

  //check IF  session exists
  if (req.session) {
    req.session.username = username;
  }

  res.render("index");
});

app.post("/", (req, res) => {
  const title = req.body.title;
  const priority = req.body.priority;
  const task = {
    title: title,
    priority: priority,
    date: todayDate(),
    id: Date.now(),
    complete: false,
  };

  tasksArr.push(task);

  res.json(task);
});

app.post("/delete", (req, res) => {
  const id = req.body.id;
  console.log("id- " + id);
  let deleteIndex = tasksArr.findIndex((i) => i.id == id);
  tasksArr.splice(deleteIndex, 1);

  res.send("task deleted");
});

app.post("/edited", (req, res) => {
  const id = req.body.id;
  const title = req.body.title;
  const complete = req.body.complete;
  const priority = req.body.priority;

  let editedIndex = tasksArr.findIndex((i) => i.id == id);

  console.log(editedIndex);

  //  editing only posted keys
  if (title) {
    tasksArr[editedIndex].title = title;
  }
  if (priority) {
    tasksArr[editedIndex].priority = priority;
  }
  //because it is boolean argument and False is valid field
  if (complete !== undefined) {
    tasksArr[editedIndex].complete = complete;
  }

  console.log(tasksArr[editedIndex]);

  res.json([tasksArr[editedIndex]]); // NOTE need to be arr so mapArr will work on single object as well

  //NOTE this code moves edited task to the end of the arr so the display order remains consistent with array
  //as an to keep the original order of array as well as be in sync with displaying tasks may need to update(fetch) all tasks so it will render it in original order but with more tasks more bandwidth..
  let newEditedTask = [];
  newEditedTask = tasksArr[editedIndex];
  tasksArr.splice(editedIndex, 1);
  tasksArr.push(newEditedTask);
});

app.get("/", (req, res) => {
  // res.send("WORKING");
  res.render("index");
});

//posting to the sever , body of post(from user/client) passing values if it is matches request body

app.listen(PORT, () => console.log("server is running"));
