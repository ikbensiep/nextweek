const today = new Date();
const weekdays  = document.querySelectorAll('.weekdays li');
let selectedWeekday = 0;
let selectedMoment;
let selectedDate;
const todos = JSON.parse(localStorage.getItem('todos')) || [];

function selectDay () {
    selectedWeekday = parseInt(this.dataset.day);
    selectedDate = parseInt(this.dataset.date);
    
    weekdays.forEach(weekday => {
        weekday.classList.remove('selected');
    });
    this.classList.add('selected');
    displayTodos();
}

function displayTodos () {
    let days = [];
            
    weekdays.forEach(weekday => {
        let date = parseInt(weekday.dataset.date);
        let todaystodos = todos.filter(todo => (todo.date == date));
        let html = todaystodos.map(todo => `<li data-moment="${todo.moment}">${todo.label}</li>`);
        days.push(`<ul class="${selectedDate == date ? 'selected' : ''}" data-day="${date}">${html.join('')}</ul>`);
    });
    
    document.querySelector('.todo-schedule').innerHTML = days.join('');

}

// sets html data-attribute to day's date
function displayWeek () {
    let todaysDate = today.getDate();
    let weekstartDate = today.getDate() - today.getDay();

    for (var i=0; i<weekdays.length; i++) {
        weekdays[i].dataset.date = weekstartDate + i;
    }
}

function saveTask (e) {
    e.preventDefault();
    let label = this.querySelector('input[name=task-label]');
    let selectedMoment = (this.querySelector('[name=task-moment]')).value;

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
    todaystasks.appendChild(li);
    
    document.querySelector('[name=task-moment]').selectedIndex = todaystasks.childNodes.length;

    if (todaystasks.childNodes.length == 2) {
        document.forms[0]['task-moment'].addAttribute('disabled');
    } else {
        document.forms[0]['task-moment'].removeAttribute('disabled');
    }
}

function initialize () {
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
}

initialize();