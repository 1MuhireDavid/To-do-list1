let form = document.getElementById("form");
let taskList = document.getElementById('tasks');
let data = [];
let editedIndex = -1; // Variable to track the index of the task being edited
var list = document.querySelector('ul');


// Model opening, clearing and closing
function openModal() {
    document.getElementById('form').style.display = 'flex';
    clearForm();
}

function closeModal() {
    document.getElementById('form').style.display = 'none';
    clearForm();
}

function clearForm() {
    editedIndex = -1;
    document.getElementById('taskName').value = '';
    document.getElementById('taskDate').value = '';
    document.getElementById('taskDescription').value = '';
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    var taskName = document.getElementById('taskName').value;
    var taskDate = document.getElementById('taskDate').value;
    var taskDescription = document.getElementById('taskDescription').value;
    var taskTags = document.getElementById('taskTags').value;

    if (taskName === '' || taskDate === '' || taskDescription === '') {
    } else {

        if (editedIndex !== -1) {
            // Update existing task if in edit mode
            data[editedIndex] = { taskName, taskDate, taskDescription, important: false, categories: taskTags.split(',').map(tag => tag.trim()) };
        } else {
            // Add new tasks to the beginning of the array
            data.unshift({ taskName, taskDate, taskDescription, important: false, categories: taskTags.split(',').map(tag => tag.trim()) });
        }

        saveTask();
    }
});

function saveTask() {
    sortAndRender();
    // Save tasks to localStorage
    localStorage.setItem('tasks', JSON.stringify(data));
    closeModal(); // Close the modal after saving
    updateCategoryFilterOptions();
}

function deleteTask(index) {
    data.splice(index, 1);
    saveTask();
    updateCategoryFilterOptions()
}

function editTask(index) {
    openModal(); // Open the modal for editing
    editedIndex = index;
    // Pre-fill the form with the task details for editing
    document.getElementById('taskName').value = data[index].taskName;
    document.getElementById('taskDate').value = data[index].taskDate;
    document.getElementById('taskDescription').value = data[index].taskDescription;
    document.getElementById('taskTags').value = data[index].categories.join(', ');

}

function toggleImportant(index) {
    data[index].important = !data[index].important;
    saveTask();
}

const render = () => {
    taskList.innerHTML = ''; // Clear the existing list before rendering

    data.forEach((task, index) => {
        const dueDatePassed = new Date(task.taskDate) < new Date();

        var newTask = `
        <li class="${task.important ? 'important' : ''} ${dueDatePassed ? 'due-past' : ''}">
            <span style="font-weight: bold;">${task.taskName}</span>
            <span>${task.taskDate}</span>
            <p>${task.taskDescription}</p>
            <p>Categories: ${task.categories.join(', ')}</p>
            <span class="options">
                <i class="${task.important ? 'fa-solid' : 'fa-regular'} fa-star" onclick="toggleImportant(${index})"></i>
                <i class="fa-solid fa-pen-to-square" onclick="editTask(${index})"></i>
                <i class="fa-solid fa-trash" onclick="deleteTask(${index})"></i>
            </span>
        </li>`;
        taskList.innerHTML += newTask;
    });
};


function sortAndRender() {
    // Sort tasks based on importance (important tasks first)
    data.sort((a, b) => (b.important ? 1 : 0) - (a.important ? 1 : 0));
    render();
}

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        data = JSON.parse(storedTasks);
        sortAndRender();
        updateCategoryFilterOptions();
    }
});

// Function to update category filter dropdown options
function updateCategoryFilterOptions() {
    const categoryFilterSelect = document.getElementById('categoryFilter');

    // Get all unique categories from tasks
    const allCategories = data.reduce((categories, task) => {
        return [...categories, ...task.categories];
    }, []);

    // Remove duplicate categories
    const uniqueCategories = Array.from(new Set(allCategories));

    // Update category filter dropdown options
    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilterSelect.appendChild(option);
    });
}


list.addEventListener('click', function (ev) {
    if (ev.target.tagName === 'SPAN' || ev.target.tagName === 'P') {
        // Find the parent li element and toggle the 'checked' class
        const listItem = ev.target.closest('li');
        if (listItem) {
            listItem.classList.toggle('checked');
        }
    }
}, false);

function filterTasks() {
    var categoryFilter = document.getElementById('categoryFilter').value;

    // Filter tasks based on the selected category
    var filteredTasks = categoryFilter === 'all' ? data : data.filter(task => task.categories.includes(categoryFilter));

    // Render the filtered tasks
    renderFilteredTasks(filteredTasks);
}

function renderFilteredTasks(filteredTasks) {
    taskList.innerHTML = ''; // Clear the existing list before rendering
    
    filteredTasks.forEach((task, index) => {
        const dueDatePassed = new Date(task.taskDate) < new Date();
        var newTask = `
         <li class="${task.important ? 'important' : ''} ${dueDatePassed ? 'due-past' : ''}">
            <span style="font-weight: bold;">${task.taskName}</span>
            <span>${task.taskDate}</span>
            <p>${task.taskDescription}</p>
            <p>Categories: ${task.categories.join(', ')}</p>
            <span class="options">
                <i class="${task.important ? 'fa-solid' : 'fa-regular'} fa-star" onclick="toggleImportant(${index})"></i>
                <i class="fa-solid fa-pen-to-square" onclick="editTask(${index})"></i>
                <i class="fa-solid fa-trash" onclick="deleteTask(${index})"></i>
            </span>
        </li>`;
        taskList.innerHTML += newTask;
    });
}
document.addEventListener("DOMContentLoaded", function () {
    // Set the minimum date dynamically
    const today = new Date().toISOString().split('T')[0];
    document.getElementById("taskDate").min = today;
});

// ... (rest of your script)
