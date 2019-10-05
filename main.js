const today = new Date();
const weekdays = document.querySelectorAll('.weekdays li');
let selectedWeekday = 0;
let selectedMoment;
let selectedDate;
let todos = JSON.parse(localStorage.getItem('todos')) || [];

function selectDay() {
    selectedWeekday = parseInt(this.dataset.day);
    selectedDate = parseInt(this.dataset.date);

    weekdays.forEach(weekday => {
        weekday.classList.remove('selected');
    });

    this.classList.add('selected');
    displayTodos();
}

function displayTodos() {
    let days = [];

    weekdays.forEach((weekday, i) => {
        let date = parseInt(weekday.dataset.date);
        let todaystodos = todos.filter(todo => (todo.date == date));
        let html = todaystodos.map(todo => `<li data-moment="${todo.moment}">${todo.label}<button data-action="delete">&times;</button></li>`);
        let weekdayName = document.querySelectorAll('.weekdays li')[i].textContent;
        days.push(`<ul class="${selectedDate == date ? 'selected' : ''}" data-day="${date}" id="${weekdayName}">${html.join('')}</ul>`);
    });

    document.querySelector('.todo-schedule').innerHTML = days.join('');

    let deleteButtons = document.querySelectorAll('button[data-action=delete]');
    for (const btn of deleteButtons) {
        btn.addEventListener('click', deleteTask);
    }

    setTimeout(() => { document.location.hash = '#' + (document.querySelector('.todo-schedule ul.selected')).id }, 75);

}

// sets html data-attribute to day's date
function displayWeek() {
    let todaysDate = today.getDate();
    let weekstartDate = today.getDate() - today.getDay();

    for (var i = 0; i < weekdays.length; i++) {
        weekdays[i].dataset.date = weekstartDate + i;
    }
}

function saveTask(e) {
    e.preventDefault();

    let label = this.querySelector('input[name=task-label]');
    let selectedMoment = (this.querySelector('[name=task-moment]')).value;

    var todaystasks = document.querySelector('ul.selected');
    if (todaystasks.childNodes.length < 3) {

        let task = {
            'label': label.value,
            'date': selectedDate,
            'moment': selectedMoment ? selectedMoment : 'morning'
        }

        todos.push(task);
        localStorage.setItem('todos', JSON.stringify(todos));


        // For animation reasons, in stead of calling
        // displayTodos(); and re-render the entire calendar
        // we're inserting a node here.

        var todaystasks = document.querySelector('ul.selected');
        var li = document.createElement('li');
        var t = document.createTextNode(task.label);
        li.dataset.moment = task.moment;
        li.appendChild(t);
        let button = document.createElement('button');
        button.type = 'button';
        button.textContent = '×';
        button.addEventListener('click', deleteTask);
        li.appendChild(button);
        todaystasks.appendChild(li);

        label.value = '';
        document.body.focus();
        
        document.querySelector('[name=task-moment]').selectedIndex = todaystasks.childNodes.length;

        if (todaystasks.childNodes.length == 3) {
            document.forms[0]['task-moment'].setAttribute('disabled', '');
        } else {
            document.forms[0]['task-moment'].removeAttribute('disabled');
        }
    }
}

function deleteTask(event) {

    let day = event.target.parentNode.parentNode.getAttribute('data-day')
    let moment = event.target.parentNode.getAttribute('data-moment');

    let index = todos.findIndex(todo => (todo.date == day && todo.moment == moment));

    const newTasks = [
        ...todos.slice(0, index),
        ...todos.slice(index + 1)
    ];

    todos = newTasks;
    localStorage.setItem('todos', JSON.stringify(todos));
    displayTodos();
}

function cancelTask () {
    let input = document.querySelector('input[name=toggle-new-task]');
    input.checked = false;
}

function initialize() {
    weekdays.forEach(weekday => {
        weekday.dataset.day == today.getDay()
            ? weekday.setAttribute('class', 'today selected')
            : '';
        weekday.addEventListener('click', selectDay);
    });
    selectedDate = today.getDate();
    displayWeek();
    displayTodos();
    document.forms.addTasks.addEventListener('submit', saveTask);
    (document.querySelector('button[type=reset]')).addEventListener('click', cancelTask);
    document.addEventListener('keyup', function(e){
        if(e.keyCode == 78) (document.querySelector('input[name=toggle-new-task]')).checked = true;
        if(e.keyCode == 27) cancelTask();
    })
}

initialize();