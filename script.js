let taskData = {};

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
const columnsArray = [todo, progress, done];
let dragElement = null;

function addTask(title, desc, column) {
  const div = document.createElement("div");

  div.classList.add("task");
  div.setAttribute("draggable", "true");

  div.innerHTML = `
  <h2>${title}</h2>
  <p>${desc}</p>
  <button>Delete</button>
  `;

  column.appendChild(div);

  div.addEventListener("dragstart", (e) => {
    dragElement = div;
  });

  const deleteBtn = div.querySelector("button");
  deleteBtn.addEventListener("click", () => {
    div.remove();
    updataCount();
  });

  return div;
}

function updataCount() {
  columnsArray.forEach((col) => {
    const task = col.querySelectorAll(".task");
    const count = col.querySelector(".count");

    taskData[col.id] = Array.from(task).map((t) => {
      return {
        title: t.querySelector("h2").innerText,
        desc: t.querySelector("p").innerText,
      };
    });

    localStorage.setItem("tasks", JSON.stringify(taskData));

    count.innerText = task.length;
  });
}

if (localStorage.getItem("tasks")) {
  const data = JSON.parse(localStorage.getItem("tasks"));

  for (const col in data) {
    const column = document.querySelector(`#${col}`);
    data[col].forEach((task) => {
      addTask(task.title, task.desc, column);
    });

    const task = column.querySelectorAll(".task");
    const count = column.querySelector(".count");
    count.innerText = task.length;
  }
}

const tasks = document.querySelectorAll(".task");

tasks.forEach((task) => {
  task.addEventListener("dragstart", (e) => {
    dragElement = task;
  });
});

function addEventListener(column) {
  column.addEventListener("dragenter", (e) => {
    e.preventDefault();
    column.classList.add("hover-over");
  });
  column.addEventListener("dragleave", (e) => {
    e.preventDefault();
    column.classList.remove("hover-over");
  });

  column.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  column.addEventListener("drop", (e) => {
    e.preventDefault();

    column.appendChild(dragElement);
    column.classList.remove("hover-over");

    updataCount();
  });
}

addEventListener(todo);
addEventListener(progress);
addEventListener(done);

// modal
const toggleModal = document.querySelector("#toggle-modal");
const modal = document.querySelector(".modal");
const modalBg = document.querySelector(".modal .modal-bg");
const addTaskBtn = document.querySelector("#add-new-task");

toggleModal.addEventListener("click", () => {
  modal.classList.toggle("active");
});

modalBg.addEventListener("click", () => {
  modal.classList.remove("active");
});

addTaskBtn.addEventListener("click", () => {
  const taskTitle = document.querySelector("#task-title-input").value.trim();
  const taskDesc = document.querySelector("#task-desc-input").value.trim();

  if (!taskTitle) {
    alert("Please enter a task title.");
    return;
  }

  addTask(taskTitle, taskDesc, todo);

  updataCount();

  modal.classList.remove("active");

  document.querySelector("#task-title-input").value = "";
  document.querySelector("#task-desc-input").value = "";
});
