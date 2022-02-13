const express = require("express");
const router = express.Router();

const tasksArr = [];

console.log("___________");
console.log(tasksArr);
router.use(express.json());

function todayDate() {
  var today = new Date().toJSON().slice(0, 10).replace(/-/g, "-");
  return today;
}

router.get("/", (req, res) => {
  console.log("respond on get:");
  res.json(tasksArr);
});

router.post("/", (req, res) => {
  console.log("receive post /");
  const title = req.body.title;
  const priority = req.body.priority;
  const task = {
    title: title,
    priority: priority,
    date: todayDate(),
    id: Date.now(),
    complete: false,
  };

  console.log(task);
  tasksArr.push(task);

  res.json(task);
});

router.post("/edited", (req, res) => {
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

router.post("/delete", (req, res) => {
  const id = req.body.id;
  console.log("id- " + id);
  let deleteIndex = tasksArr.findIndex((i) => i.id == id);
  tasksArr.splice(deleteIndex, 1);

  res.send("task deleted");
});

module.exports = router;
