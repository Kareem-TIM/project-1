const inputname = document.getElementById("name");
const inputage = document.getElementById("age");
const inputgrade = document.getElementById("grade");
const studentTable = document.getElementById("studentTable");
const studentform = document.getElementById("studentForm");
const tbody = document.querySelector("tbody");
const submitButton = studentform.querySelector("button[type='submit']");
const viewDiv = document.getElementById("div-view");
let editingRow = null;
let id = 0;

async function fetchStudents() {
    try {
        const response = await fetch(`${{ vars.APILINK }}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        data.forEach(student => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.age}</td>
                <td>${student.grade}%</td>
                <td>
                    <button class="btn btn-info btn-sm" onclick="viewStudent(this)">View</button>
                    <button class="btn btn-warning btn-sm" onclick="editStudent(this)">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteStudent(this)">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
        id = tbody.rows.length;
        return data;
    } catch (error) {
        console.error("Failed to fetch students:", error);
    }
}

fetchStudents();

studentform.addEventListener("submit", async function (event) {
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
    const age = Number(inputage.value);
    const grade = Number(inputgrade.value);

    if (editingRow) {
        try {
            submitButton.disabled = true;
            submitButton.textContent = "Saving...";

            const studentId = Number(editingRow.cells[0].textContent);
            const response = await fetch("https://studens-api-pyfastapi-beige.vercel.app/students", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: studentId,
                    name,
                    age,
                    grade
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            editingRow.cells[1].textContent = name;
            editingRow.cells[2].textContent = age;
            editingRow.cells[3].textContent = grade + "%";
            editingRow = null;
            studentform.reset();
        } catch (error) {
            console.error("Failed to update student:", error);
            alert("Unable to update student right now.");
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Add";
        }
        return;
    }

    try {
        submitButton.disabled = true;
        submitButton.textContent = "Adding...";

        const studentId = id + 1;
        id = studentId;

        const response = await fetch("https://studens-api-pyfastapi-beige.vercel.app/students", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: studentId,
                name,
                age,
                grade
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const newStudent = await response.json();
        const rowId = newStudent.id ?? studentId;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${rowId}</td>
            <td>${newStudent.name ?? name}</td>
            <td>${newStudent.age ?? age}</td>
            <td>${newStudent.grade ?? grade}%</td>
            <td>
                <button class="btn btn-info btn-sm" onclick="viewStudent(this)">View</button>
                <button class="btn btn-warning btn-sm" onclick="editStudent(this)">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteStudent(this)">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
        studentform.reset();
    } catch (error) {
        console.error("Failed to add student:", error);
        alert("Unable to save student right now.");
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Add";
    }
});

var viewStudent = function (button) {
    const row = button.closest("tr");
    const rowId = row.cells[0].textContent;
    const name = row.cells[1].textContent;
    const age = row.cells[2].textContent;
    const grade = row.cells[3].textContent;

    if (viewDiv.dataset.currentId === rowId) {
        viewDiv.innerHTML = "";
        viewDiv.classList.remove("active");
        delete viewDiv.dataset.currentId;
        viewDiv.classList.remove("div-view");
        viewDiv.classList.remove("active");
        return;
    }

    viewDiv.dataset.currentId = rowId;
    viewDiv.innerHTML = `
        <h3>Student Details</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Age:</strong> ${age}</p>
        <p><strong>Grade:</strong> ${grade}</p>
    `;
    viewDiv.classList.add("div-view");
    viewDiv.classList.add("active");
};

var editStudent = function (button) {
    const row = button.closest("tr");
    const gradeText = row.cells[3].textContent.replace(/%/g, "").trim();

    inputname.value = row.cells[1].textContent;
    inputage.value = row.cells[2].textContent;
    inputgrade.value = gradeText;
    editingRow = row;
    submitButton.textContent = "Save";
};

var deleteStudent = async function (button) {
    const row = button.closest("tr");
    const studentId = Number(row.cells[0].textContent);
    try {
        const response = await fetch("https://studens-api-pyfastapi-beige.vercel.app/students", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: studentId })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        viewDiv.innerHTML = "";
        row.remove();
    } catch (error) {
        console.error("Failed to delete student:", error);
        alert("Unable to delete student right now.");
    }
};