const taskInput = document.getElementById('taskInput');

const addBtn = document.getElementById('addBtn');

const taskList = document.getElementById('taskList');

function addTask() {

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Escribe una tarea antes");
        return;
    }

    const li = document.createElement('li');
    
    const checkbox = document.createElement('input');

    checkbox.type = 'checkbox';
    
    const span = document.createElement('span');

    span.textContent = taskText;

    const deleteBtn = document.createElement('button');

    deleteBtn.textContent = 'X';

    deleteBtn.className = 'delete-btn';


    checkbox.addEventListener('change', function() {
        if (checkbox.checked) {
            span.classList.add('completed');
        } else {
            span.classList.remove('completed');
        }
    });

    deleteBtn.addEventListener('click', function() {
        li.remove();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);

   
    taskList.appendChild(li);


    taskInput.value = "";
}


addBtn.addEventListener('click', addTask);


taskInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});
