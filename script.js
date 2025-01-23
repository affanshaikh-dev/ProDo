document.addEventListener('DOMContentLoaded', () => {
    const addTodo = document.querySelector('.add');
    const taskInput = document.getElementById('taskInput');
    const taskSection = document.querySelector('.taskSection');
    const clearAll = document.querySelector('.clearAll');
    const filterButtons = document.querySelectorAll('.btnsContainer button');
    
    const placeholderImageURL = 'img/no-task.png';

    let todoArr = JSON.parse(localStorage.getItem('Item of Todo')) || [];

    const displayTasks = (filter = 'all') => {
        taskSection.innerHTML = '';
        let filteredTasks;
        if (filter === 'completed') {
            filteredTasks = todoArr.filter(task => task.completed);
        } else if (filter === 'incomplete') {
            filteredTasks = todoArr.filter(task => !task.completed);
        } else {
            filteredTasks = todoArr;
        }

        if (filteredTasks.length === 0) {
            const placeholderImage = document.createElement('img');
            placeholderImage.src = placeholderImageURL;
            placeholderImage.alt = 'No tasks, add something!';
            taskSection.appendChild(placeholderImage);
        } else {
            filteredTasks.forEach((task, index) => {
                const taskItem = document.createElement('li');
                taskItem.classList.add('taskItem');
                taskItem.innerHTML = `
                    <div class="taskDetails">
                        <input type="checkbox" name="checkbox" id="checkBox" data-index="${index}" ${task.completed ? 'checked' : ''}>
                        <p ${task.completed ? 'class="completed"' : ''}>${task.text}</p>
                    </div>
                    <div class="taskBtns">
                        <i class="ri-edit-2-line edit" data-index="${index}"></i>
                        <i class="ri-close-line close" data-index="${index}"></i>
                    </div>
                `;
                taskSection.appendChild(taskItem);
            });
        }
    };

    const updateLocalStorage = () => {
        localStorage.setItem('Item of Todo', JSON.stringify(todoArr));
    };

    addTodo.addEventListener('click', () => {
        if (taskInput.value.trim() != 0) {
            todoArr.push({ text: taskInput.value, completed: false });
            taskInput.value = '';
            updateLocalStorage();
            displayTasks();
        }
    });

    taskSection.addEventListener('click', (e) => {
        const index = e.target.dataset.index;
        if (e.target.matches('input[type="checkbox"]')) {
            todoArr[index].completed = e.target.checked;
            updateLocalStorage();
            displayTasks();
        } else if (e.target.matches('.edit')) {
            const newText = prompt('Edit your task:', todoArr[index].text);
            if (newText) {
                todoArr[index].text = newText;
                updateLocalStorage();
                displayTasks();
            }
        } else if (e.target.matches('.close')) {
            todoArr.splice(index, 1);
            updateLocalStorage();
            displayTasks();
        }
    });

    clearAll.addEventListener('click', () => {
        todoArr = [];
        updateLocalStorage();
        displayTasks();
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            displayTasks(button.textContent.toLowerCase());
        });
    });

    displayTasks();
});
