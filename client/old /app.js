const taskTxt = document.getElementById("taskTxt");
const taskPriority = document.getElementById("taskPriority");
const btnAdd = document.getElementById("btnAdd");
const newTasksWrap = document.getElementById("newTasksWrap");

const baseApiUrl = "http://localhost:3000";

async function getAllTasks() {
  try {
    const response = await fetch(baseApiUrl);

    const data = await response.json();
    console.log(data);
    let tasks = data.map((e) => {
      return `
      <li>${e.title} - ${e.priority}</li>

      `;
    });
    console.log(tasks);
    newTasksWrap.innerHTML = tasks.join("");
    // return data;
  } catch (error) {
    // enter your logic for when there is an error (ex. error toast)
    newTasksWrap.innerHTML = `<li></li>`;
    console.log(error);
  }
}
getAllTasks();

async function postTask(t, p, d) {
  try {
    const response = await fetch(baseApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: t,
        priority: p,
        date: d,
      }),
    });
    const data = await response.json();
    // enter you logic when the fetch is successful
    console.log(data);
  } catch (error) {
    // enter your logic for when there is an error (ex. error toast)

    console.log(error);
  }
}

btnAdd.addEventListener("click", () => {
  console.log("TESTING");
  console.log(taskTxt.value);
  console.log(taskPriority.value);

  postTask(taskTxt.value, taskPriority.value);
});
