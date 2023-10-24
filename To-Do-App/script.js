document.addEventListener('DOMContentLoaded', function () {

    const todoList = document.getElementById('todo-list');
    const newTaskInput = document.getElementById('new-task');
    const deadlineInput = document.getElementById('deadline');
    const prioritySelect = document.getElementById('priority');
    const labelInput = document.getElementById('label');
    const addButton = document.getElementById('add-button');
    const clearButton = document.getElementById('clear-button');
    const searchInput = document.getElementById('search');
    const filterSelect = document.getElementById('filter');
    let editMode = false; // Flag for editing mode
    let taskIndex = null; // Index of the task being edited

    // Retrieve tasks from local storage (if any) and display them
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Function to reset the input fields
    function resetInputs() {
        newTaskInput.value = '';
        deadlineInput.value = '';
        prioritySelect.value = 'Low';
        labelInput.value = '';
    }

    // Function to create edit and delete buttons for a task
    function createEditDeleteButtons(index) {
        const editButton = document.createElement('button');
        editButton.innerText = 'Edit';
        editButton.id = 'edit-button'; // Add the id attribute
        editButton.style.backgroundColor = '#FF4500'; // Background color
        editButton.style.color = '#fff'; // Text color
        editButton.style.border = 'none'; // Remove border
        editButton.style.padding = '10px 20px'; // Padding
        editButton.style.margin = '5px'; // Margin
        editButton.style.cursor = 'pointer'; // Cursor
        editButton.addEventListener('click', function () {
            editTask(index);
        });

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.id = 'delete-button'; // Add the id attribute
        deleteButton.style.backgroundColor = '#FF0000'; // Background color
        deleteButton.style.color = '#fff'; // Text color
        deleteButton.style.border = 'none'; // Remove border
        deleteButton.style.padding = '10px 20px'; // Padding
        deleteButton.style.margin = '5px'; // Margin
        deleteButton.style.cursor = 'pointer'; // Cursor
        deleteButton.addEventListener('click', function () {
            deleteTask(index);
        });

        return [editButton, deleteButton];
    }

    // Function to edit a task
    function editTask(index) {
        editMode = true;
        taskIndex = index;
        newTaskInput.value = tasks[index].text;
        deadlineInput.value = tasks[index].deadline;
        prioritySelect.value = tasks[index].priority;
        labelInput.value = tasks[index].label;
        addButton.innerText = 'Save';
    }

    // Function to delete a task
    function deleteTask(index) {
        tasks.splice(index, 1);
        resetInputs();
        updateTaskList();
    }

    // Add a new task or edit an existing task
    addButton.addEventListener('click', function () {
        const taskText = newTaskInput.value.trim();
        if (taskText !== '') {
            if (editMode) {
                // Editing an existing task
                tasks[taskIndex] = {
                    text: taskText,
                    completed: tasks[taskIndex].completed,
                    deadline: deadlineInput.value,
                    priority: prioritySelect.value,
                    label: labelInput.value,
                };
                editMode = false;
                taskIndex = null;
                addButton.innerText = 'Add';
            } else {
                // Adding a new task
                const task = {
                    text: taskText,
                    completed: false,
                    deadline: deadlineInput.value,
                    priority: prioritySelect.value,
                    label: labelInput.value,
                };
                tasks.push(task);
                
            }
            resetInputs();
            updateTaskList();
        }
    });

    // Mark a task as completed or uncompleted
    todoList.addEventListener('click', function (event) {
        if (event.target.tagName === 'LI') {
            const index = event.target.dataset.index;
            tasks[index].completed = !tasks[index].completed;
            updateTaskList();
        }
    });


    // Clear completed tasks
    clearButton.addEventListener('click', function () {
        tasks = tasks.filter(task => !task.completed);
        updateTaskList();
    });

    // Filter and search tasks
    searchInput.addEventListener('input', function () {
        updateTaskList();
    });

    filterSelect.addEventListener('change', function () {
        updateTaskList();
    });




    function updateTaskList() {
        const searchTerm = searchInput.value.toLowerCase();
        const filter = filterSelect.value;

        const filteredTasks = tasks.filter(task => {
            const text = task.text.toLowerCase();
            if (filter === 'all') {
                return text.includes(searchTerm);
            } else if (filter === 'completed') {
                return text.includes(searchTerm) && task.completed;
            } else if (filter === 'incomplete') {
                return text.includes(searchTerm) && !task.completed;
            }
        });

        localStorage.setItem('tasks', JSON.stringify(tasks));
        todoList.innerHTML = '';
        filteredTasks.forEach((task, index) => {
            const listItem = document.createElement('li');
            listItem.innerText = task.text;
            listItem.classList.toggle('completed', task.completed);
            listItem.setAttribute('data-index', index);

            // Add deadline, priority, and label to the task display
            if (task.deadline) {
                listItem.innerText += ` (Deadline: ${task.deadline})`;
            }
            if (task.priority !== 'Low') {
                listItem.innerText += ` (Priority: ${task.priority})`;
            }
            if (task.label) {
                listItem.innerText += ` (Label: ${task.label})`;
                listItem.setAttribute('label', task.label);
            }

            const [editButton, deleteButton] = createEditDeleteButtons(index);
            listItem.appendChild(editButton);
            listItem.appendChild(deleteButton);

            todoList.appendChild(listItem);
        });
    }

    // Initial display
    updateTaskList();
})
