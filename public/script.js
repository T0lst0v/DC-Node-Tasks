const taskTxt = document.getElementById("taskTxt");
const taskPriority = document.getElementById("taskPriority");
const btnAdd = document.getElementById("btnAdd");
const newTasksH = document.getElementById("newTasksH");
const newTasksM = document.getElementById("newTasksM");
const newTasksL = document.getElementById("newTasksL");
const completedTasksWrap = document.getElementById("completedTasksWrap");
const prioritySelectors = document.querySelectorAll('input[name="prioritySelector"]');
// const priority = document.querySelector('input[name = "prioritySelector"]:checked').value;  //not working

const baseApiUrl = "/tasks";

//getting tasks from the server
async function getAllTasks() {
  try {
    const response = await fetch(baseApiUrl);

    console.log("getting all ++++++");

    let tasks = await response.json();

    console.log("tasksArr:");
    console.log(tasks);
    return tasks;
  } catch (error) {
    // logic for when there is an error (ex. error toast)
    console.log(error);
  }
}

// displaying passed array(after formatting it with HTML) of task objects
async function displayFetchedTasks(arr) {
  let tasks = await arr;
  console.log("arr=");
  console.log(arr);
  if (!tasks) {
    return;
  }
  //formatting tasks to HTML
  tasks.map(async (e) => {
    console.log(e);
    let taskHTML = await taskToHTML(e);
    //if flagged(checkbox) as complete move to completedTasksWrap div
    if (e.complete) {
      completedTasksWrap.insertAdjacentHTML("afterbegin", taskHTML);
      return;
    }
    // displaying by grouping by priorities
    priorityGroup(e.priority).insertAdjacentHTML("afterbegin", taskHTML);
  });
}

// sending new task to the server
async function postTask(title, priority) {
  console.log("task posting");
  try {
    console.log("try posting");
    const response = await fetch(baseApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        priority: priority,
      }),
    });
    const task = await response.json();
    console.log("responce: ");
    console.log(task);

    // when the fetch is successful returns posted {task}+id, complete-false, date
    priorityGroup(priority).insertAdjacentHTML("afterbegin", await taskToHTML(task));
  } catch (error) {
    // enter your logic for when there is an error (ex. error toast)

    console.log(error);
  }
}

// sending task changes to the server
async function postEditedTask(id, complete, title, priority) {
  //not all 4 elements need to be posted but ID is a must
  try {
    const response = await fetch(`${baseApiUrl}/edited`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        complete: complete,
        title: title,
        priority: priority,
      }),
    });

    const editedTask = await response.json(); //response is [{editedTask}]

    displayFetchedTasks(editedTask);
    console.log("editedTask");
    console.log(editedTask);
  } catch (error) {
    // logic for when there is an error (ex. error toast)

    console.log(error);
  }
}

// posting/deleting  task to the server
async function postDeleteTask(id) {
  console.log(id);
  try {
    const response = await fetch(`${baseApiUrl}/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        id: id,
      }),
    });
    const res = await response.text();
    console.log(res);
  } catch (error) {
    // enter your logic for when there is an error (ex. error toast)

    console.log(error);
  }
}

//  passing length (i) of fetched taskArray(if exists) to determine next index number
// technically generateIndex() supposed to match fetched array[indexing]
function* generateIndex(i) {
  let id = i || 1;

  while (true) {
    yield id;
    id++;
  }
}

// formatting task object with HTML Tags
async function taskToHTML(task) {
  const taskArr = await getAllTasks();
  let id = generateIndex(taskArr.length); //{id-1} - to start with 0 index
  id = id.next().value;

  const liTask = `
  <li id=${task.id} class="task" data-index= ${id - 1} draggable="true"> 
  <label class="triangle ${task.priority}"  ></label>
  <input type="checkbox" ${task.complete ? "checked" : "unchecked"} class="checkbox" onclick="ifChecked(event)">
  <label class="textField">${task.title}</label>
  <button class="editTask" onclick="editTask(event)">edit</button>
 
  <button class="deleteTask" onclick="deleteTask('${task.id}')">???</button>
</li>`;

  addEventListeners();

  return liTask;
}

// defining (ul) group to sort by priority
function priorityGroup(p) {
  let group = p === "high" ? newTasksH : p === "med" ? newTasksM : newTasksL;
  return group;
}

// checking what priority selector was checked
function selectedPriority() {
  let selected;
  for (const selector of prioritySelectors) {
    if (selector.checked) {
      selected = selector.value;
      return selected;
    }
  }
}

//// EXECUTION:

displayFetchedTasks(getAllTasks());

btnAdd.addEventListener("click", () => {
  // if no input -> Red placeholder
  //FIXME: need to put reject on space input and min 3 symbols
  if (taskTxt.value === "") {
    taskTxt.style.color = "red";

    return;
  }
  console.log("no task");
  console.log(taskTxt.value);
  //posting to the server and receiving it back as object with extra fields(id..)
  //sorted and placed at receiving end of the post
  postTask(taskTxt.value, selectedPriority());

  taskTxt.value = null; //clearing input field
});

taskTxt.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    btnAdd.click();
  }
});

// any input get rid off Red PlaceHolder
taskTxt.addEventListener("keydown", (event) => {
  taskTxt.style.color = "inherit";
});

//called from HTML when task is checked/unchecked for completion
function ifChecked(event) {
  const id = event.target.parentElement.id;

  const checkedElement = document.getElementById(id);
  const condition = event.target.checked;

  postEditedTask(id, condition); // send to server edits and receives edited task obj, witch will be sorted and placed at receiving of the post
  checkedElement.remove(); // to avoid displaying  duplication
}

//deleting task called from the HTML button
function deleteTask(id) {
  console.log(id);
  document.getElementById(id).remove();
  postDeleteTask(id);
}

function editTask(event) {
  console.log(event.target);
}

function addEventListeners() {
  console.log("adding listeners");
  const draggables = document.querySelectorAll(".task");
  const dragListItem = document.querySelectorAll("#newTasksL li");

  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", dragStart);
  });

  dragListItem.forEach((item) => {
    console.log("for list-----");
    item.addEventListener("dragenter", dragEnter);
    item.addEventListener("dragover", dragOver);
    item.addEventListener("drop", dragDrop);
    item.addEventListener("dragleave", dragLeave);
  });
}

function dragStart(ev) {
  console.log("Event:", "dragStart");
  const draggedTask = this;
  console.log(draggedTask);
  ev.dataTransfer.setData("text", ev.target.id);
}
function dragEnter() {
  // console.log(this);

  this.classList.add("over");
}

function dragLeave() {
  this.classList.remove("over");
}

function dragOver(ev) {
  this.classList.add("over");
  ev.preventDefault();
}

function dragDrop(ev) {
  console.log("Event:", "drag drop");
  console.log(this);
  const id = ev.dataTransfer.getData("text");
  console.log("id=" + id);
  console.log("dragged ");
  console.log(document.getElementById(id));
  console.log("instead of ");
  console.log(this);

  if (this != document.getElementById(id)) {
    console.log("not SAME");
    this.parentNode.insertBefore(document.getElementById(id), this);
  }
  console.log("Event:", "dragDrop");
  this.classList.remove("over");
  ev.preventDefault();
}
