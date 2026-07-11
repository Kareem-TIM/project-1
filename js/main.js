const inputname = document.getElementById("name");
const inputage = document.getElementById("age");
const inputgrade = document.getElementById("grade");
const studentTable = document.getElementById("studentTable");
const studentform = document.getElementById("studentForm");
const tbody = document.querySelector("tbody");
const submitButton = studentform.querySelector("button[type='submit']");
const viewDiv = document.getElementById("div-view");
let editingRow = null;
let id = tbody.rows.length;

studentform.addEventListener("submit", function(event) {
    event.preventDefault();

    if (
      inputname.value.trim() === "" ||
      inputage.value.trim() === "" ||
      inputgrade.value.trim() === ""
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const name = inputname.value.trim();
    const age = inputage.value.trim();
    const grade = inputgrade.value.trim();

    if (editingRow) {
        editingRow.cells[1].textContent = name;
        editingRow.cells[2].textContent = age;
        editingRow.cells[3].textContent = grade;
        editingRow = null;
        submitButton.textContent = "Add";
    } else {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${++id}</td>
            <td>${name}</td>
            <td>${age}</td>
            <td>${grade}%</td>
            <td>
                <button class="btn btn-info btn-sm" onclick="viewStudent(this)">View</button>
                <button class="btn btn-warning btn-sm" onclick="editStudent(this)">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteStudent(this)">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    }

    studentform.reset();
});

var viewStudent = function(button) {
    const row = button.closest("tr");
    const rowId = row.cells[0].textContent;
    const name = row.cells[1].textContent;
    const age = row.cells[2].textContent;
    const grade = row.cells[3].textContent;

    if (viewDiv.dataset.currentId === rowId) {
        viewDiv.innerHTML = "";
        delete viewDiv.dataset.currentId;
        return;
    }

    viewDiv.dataset.currentId = rowId;
    viewDiv.innerHTML = `
        <h3>Student Details</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Age:</strong> ${age}</p>
        <p><strong>Grade:</strong> ${grade}</p>
    `;
};

var editStudent = function(button) {
    const row = button.closest("tr");
    inputname.value = row.cells[1].textContent;
    inputage.value = row.cells[2].textContent;
    inputgrade.value = row.cells[3].textContent;
    editingRow = row;
    submitButton.textContent = "Save";
};

var deleteStudent = function(button) {
    const row = button.closest("tr");
    viewDiv.innerHTML = "";
    row.remove();
};

