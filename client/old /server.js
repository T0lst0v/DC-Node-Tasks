const baseApiUrl = "http://localhost:3000";

//getting tasks from the server
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

// sending new task to the server
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
