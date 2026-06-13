const form = document.getElementById("studentForm");
const tableBody = document.getElementById("studentTableBody");

let students = JSON.parse(localStorage.getItem("students")) || [];
let editIndex = -1;

// If user clicked Edit from record.html, pre-fill the form on index.html.
const storedEditIndex = localStorage.getItem("editIndex");
if (storedEditIndex !== null && storedEditIndex !== "") {
    editIndex = parseInt(storedEditIndex, 10);
    localStorage.removeItem("editIndex");

    // index.html contains the form inputs, so only fill if they exist on this page.
    const nameEl = document.getElementById("name");
    const studentIdEl = document.getElementById("studentId");
    const emailEl = document.getElementById("email");
    const contactEl = document.getElementById("contact");

    if (nameEl && studentIdEl && emailEl && contactEl && students[editIndex]) {
        nameEl.value = students[editIndex].name;
        studentIdEl.value = students[editIndex].id;
        emailEl.value = students[editIndex].email;
        contactEl.value = students[editIndex].contact;

        // bring user attention to the form
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
}

// Load existing records
displayStudents();

// Form Submit
if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const studentId = document.getElementById("studentId").value.trim();
        const email = document.getElementById("email").value.trim();
        const contact = document.getElementById("contact").value.trim();

        // Empty field validation
        if (!name || !studentId || !email || !contact) {
            alert("All fields are required.");
            return;
        }

        // Name validation (letters and spaces only)
        if (!/^[A-Za-z\s]+$/.test(name)) {
            alert("Student Name should contain only letters.");
            return;
        }

        // Student ID validation (numbers only)
        if (!/^\d+$/.test(studentId)) {
            alert("Student ID should contain only numbers.");
            return;
        }

        // Email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        // Contact validation (minimum 10 digits)
        if (!/^\d{10,}$/.test(contact)) {
            alert("Contact Number must contain at least 10 digits.");
            return;
        }

        const student = {
            name,
            id: studentId,
            email,
            contact
        };

        if (editIndex === -1) {
            students.push(student);
        } else {
            students[editIndex] = student;
            editIndex = -1;
        }

        localStorage.setItem("students", JSON.stringify(students));

        form.reset();
        displayStudents();
        alert("Student Added Successfully!");
         window.location.href = "record.html";
    });
}

// Display Students
function displayStudents() {

    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (students.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;">
                    No Student Records Found
                </td>
            </tr>
        `;
        return;
    }

    students.forEach((student, index) => {
    tableBody.innerHTML += `
        <tr>
            <td>${student.name}</td>
            <td>${student.id}</td>
            <td>${student.email}</td>
            <td>${student.contact}</td>
            <td>
                <button
                    onclick="editStudent(${index})"
                    style="
                        background:#f59e0b;
                        color:white;
                        border:none;
                        padding:8px 16px;
                        border-radius:8px;
                        cursor:pointer;
                        font-weight:600;
                        margin-right:5px;
                    ">
                    Edit
                </button>

                <button
                    onclick="deleteStudent(${index})"
                    style="
                        background:#ef4444;
                        color:white;
                        border:none;
                        padding:8px 16px;
                        border-radius:8px;
                        cursor:pointer;
                        font-weight:600;
                    ">
                    Delete
                </button>
            </td>
        </tr>
    `;
});

    addVerticalScrollbar();
}

// Edit Student
function editStudent(index) {
    // On record.html the form inputs don't exist, so store the target and redirect to index.html.
    localStorage.setItem("editIndex", String(index));
    window.location.href = "index.html";
}

// Delete Student
function deleteStudent(index) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this record?"
    );

    if (!confirmDelete) return;

    students.splice(index, 1);

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

    displayStudents();
}

// Dynamic Vertical Scrollbar
function addVerticalScrollbar() {

    const tableContainer =
        document.querySelector(".table-container") ||
        document.querySelector(".table-responsive");

    if (!tableContainer) return;

    if (students.length > 5) {
        tableContainer.style.maxHeight = "300px";
        tableContainer.style.overflowY = "auto";
    } else {
        tableContainer.style.maxHeight = "";
        tableContainer.style.overflowY = "hidden";
    }
}