var addBtn = document.getElementById("add-btn");
var modal = document.getElementById("add-modal");
var saveBtn = document.getElementById("save-btn");
const token = localStorage.getItem('token');
const authorization = `kokoz ${token}`;
const taskForm = $("#task-form");
const taskTitle = $("#task-title");
const taskDescription = $("#task-description");
const taskAssign = $("#task-assign");
const taskDeadline = $("#task-deadline");
const taskStatus = $("#task-status");
const toDoList = $(".card[data-status='ToDo'] .list-items");
const doingList = $(".card[data-status='Doing'] .list-items");
const doneList = $(".card[data-status='Done'] .list-items");
const dropdownMenu = document.querySelectorAll("dropdown-menu");
let checkPoint = '';
//
//
//Profile Page
//update user data
//email pages (confirmation, send and ResSend Confirmation, unSupscripe)
//
//
const makeValidation = (taskData) => {
    const { title, description, status, assignTo, deadline } = taskData;
    let isValid = true; // Assume form inputs are valid by default
    // Validate title field
    if (title === '') {
        document.getElementById('title-error').textContent = 'Title is required';
        isValid = false;
    } else {
        document.getElementById('title-error').textContent = '';
    }

    // Validate description field
    if (description === '') {
        document.getElementById('description-error').textContent = 'Description is required';
        isValid = false;
    } else {
        document.getElementById('description-error').textContent = '';
    }

    // Validate deadline field
    if (deadline === '') {
        document.getElementById('deadline-error').textContent = 'Deadline is required';
        isValid = false;
    } else {
        document.getElementById('deadline-error').textContent = '';
    }

    // // Validate status field
    // if (status === '') {
    //     document.getElementById('status-error').textContent = 'Status is required';
    //     isValid = false;
    // } else {
    //     document.getElementById('status-error').textContent = '';
    // }

    // Validate assign field
    if (assignTo === '') {
        document.getElementById('assign-error').textContent = 'AssignTo is required';
        isValid = false;
    } else if (!isValidEmail(assignTo)) {
        document.getElementById('assign-error').textContent = 'Invalid email address';
        isValid = false;
    } else {
        document.getElementById('assign-error').textContent = '';
    }

    // If the form inputs are valid, submit the form
    if (isValid) {
        // taskForm.submit();
        $('#add-modal').modal('hide');
        return isValid;
    }
    else {
        console.log("errorsssss");
    }
}

function isValidEmail(email) {
    // Regular expression for validating email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

const createTaskInDB = async (taskData) => {
    try {
        console.log(taskData);
        const data = await $.ajax({
            url: 'http://localhost:5000/task/addTask',
            type: 'POST',
            data: JSON.stringify(taskData),
            headers: {
                'authorization': authorization,
                'Content-Type': 'application/json'
            }
        });
        console.log("data");
        console.log(data.responseSaved);
        return createTaskCard(data.responseSaved);

    } catch (error) {
        console.log("catch======");
        $('#message').html('Error: ' + error);
        return null;
    }
}

const createTaskCard = (data, update = false) => {
    console.log(data);
    if (!data || !data.validationErr) {
        let task, message;
        if (update) {
            task = $(`#${data._id.toString()}`);
            message = "Task Updated Successfully";
        }
        else {
            task = $(`<li class="card draggable" data-status=${data.status}></li>`);
            message = "Task Added Successfully";
        }

        let header;
        let dropdownMenu;
        if ((new Date(data.deadline) < new Date()) && (data.status !== "Done")) {
            header = $('<div id="late-task" class="card-header task-card-header">' + data.title +
                ' <div class="dropdown-container">' +
                `<i id="dropdown-btn-${data._id.toString()}" class="fas fa-ellipsis-v" data-task-id="${data._id.toString()}">...</i>` +
                `<div id="dropdown-menu-${data._id.toString()}" class="dropdown-menu" style="width: auto;"><a id="update" class="menu-drops" value="update">Update</a><br>` +
                '<a id="delete" class="menu-drops" value="delete">Delete</a>' +
                '</div> </div> </div>');

            // Add a dropdown menu with animation
            dropdownMenu = document.createElement('div');
            dropdownMenu.classList.add('dropdown-menu-late', 'animated');
            dropdownMenu.innerHTML = '<p>Late Task!</p>';

            //Add Event Listener On Late Task Headers
            task.on('mouseenter', () => {
                dropdownMenu.classList.add('fadeInDown');
                dropdownMenu.style.display = "block";
            });
            task.on('mouseleave', () => {
                dropdownMenu.classList.remove('fadeInDown');
                dropdownMenu.style.display = "none";
            });
        }
        else {
            header = $('<div class="card-header task-card-header">' + data.title + '<span id="late-task"></span>' +
                ' <div class="dropdown-container">' +
                `<i id="dropdown-btn-${data._id.toString()}" class="fas fa-ellipsis-v" data-task-id="${data._id.toString()}">...</i>` +
                `<div id="dropdown-menu-${data._id.toString()}" class="dropdown-menu" style="width: auto;"><a id="update" class="menu-drops" value="update">Update</a><br>` +
                '<a id="delete" class="menu-drops" value="delete">Delete</a>' +
                '</div> </div> </div>');
        }

        console.log("Task ID:", data._id.toString());
        const body = $('<div class="card-body"></div>');
        const desc = $('<p class="card-text">' + data.description + '</p>');
        const assign = $('<p class="card-text">' + data.assignTo.email + '</p>');
        const due = $('<p class="card-text"><hr><small class="text-muted">Due ' + data.deadline + '</small></p>');
        const info = $('<a href="#" class="card-link">Info</a>');
        body.append(desc);
        body.append(assign);
        body.append(due);
        body.append(info);
        if (!update) {
            task.append(header);
            task.append(dropdownMenu);
            task.append(body);
            task.attr("draggable", "true");
            task.attr("id", `${data._id.toString()}`);
            task.on("dragstart", dragStart);
            task.on("dragend", dragEnd);
            $('#message').html(data.message);
            return appendTask(task, message);
        } else {
            task.empty();
            task.append(header);
            task.append(dropdownMenu);
            task.append(body);
            task.attr("draggable", "true");
            task.attr("id", `${data._id.toString()}`);
            task.on("dragstart", dragStart);
            task.on("dragend", dragEnd);
            $('#message').html(data.message);
            const taskCardElement = document.getElementById(data._id.toString());
            taskCardElement.remove();
            return appendTask(task, message);
        }
    } else {
        $('#message').html(data.validationErr);
        return null;
    }
}

const getTasksFromDB = async (authorization) => {
    try {
        console.log(authorization);
        const data = await $.ajax({
            url: 'http://localhost:5000/user/myTasks',
            type: 'GET',
            headers: {
                'authorization': authorization,
                'Content-Type': 'application/json'
            }
        });
        console.log(data);
        logTasks(data)
    } catch (error) {
        console.log("catch======", error);
        $('#message').html('Error: ' + error);
        return null;
    }
}



const logTasks = (obj) => {
    console.log("logTasks==========");
    if (obj instanceof Object) {
        if (Array.isArray(obj.assignedTasks)) {
            console.log("assignedTasks:");
            obj.assignedTasks.forEach(task => createTaskCard(task));
        }
        if (Array.isArray(obj.createdTasks)) {
            console.log("createdTasks:");
            obj.createdTasks.forEach(task => createTaskCard(task));
        }
        for (var key in obj) {
            logTasks(obj[key]);
        }
    }
}

const appendTask = (task, message) => {
    console.log("task");
    console.log(task);
    const dataStatus = $(task).attr("data-status");
    switch (dataStatus) {
        case "ToDo":
            toDoList.append(task);
            break;
        case "Doing":
            doingList.append(task);
            break;
        case "Done":
            doneList.append(task);
            break;
        default:
            break;
    }
    addEventListenerOnTask(task);
    popupConfirmMessage(message);
    return;
}

function dragStart(event) {
    event.originalEvent.dataTransfer.setData("text/plain", event.target.id);
    event.target.classList.add("dragging");
}

function dragEnd(event) {
    event.target.classList.remove("dragging");
}

$(".droppable").on("dragover", function (event) {
    event.preventDefault();
    $(this).addClass("valid-drop-target");
});

$(".droppable").on("dragleave", function (event) {
    $(this).removeClass("valid-drop-target");
});

$(".droppable").on("drop", async function (event) {
    event.preventDefault();
    $(this).removeClass("valid-drop-target");
    const taskId = event.originalEvent.dataTransfer.getData("text/plain");
    const task = $("#" + taskId);
    const currentList = task.parent();
    const newList = $(this).find(".list-items");
    if (currentList[0] !== newList[0]) {
        task.attr("data-status", $(this).data("status"));
        const status = $(this).data("status");
        showLoadIcon();
        const data = await $.ajax({
            url: 'http://localhost:5000/task/updateTaskStatus',
            type: 'PUT',
            data: JSON.stringify({ status, taskId }),
            headers: {
                'authorization': authorization,
                'Content-Type': 'application/json'
            }
        });
        console.log("----------------------------------------");
        console.log(data);
        newList.append(task);
        hideLoadIcon();
    }
});

// Get Tasks From DB
// Get Tasks From DB
$(async function () {
    await getTasksFromDB(authorization);
    // addEventListenerOnTasks();
});

const createUpdateForm = (taskId) => {
    const taskCard = document.getElementById(taskId);
    const taskTitleValue = taskCard.querySelector('.card-header.task-card-header').childNodes[0].textContent.trim(); const taskDescriptionValue = taskCard.querySelector(".card-body .card-text:first-child").textContent.trim();
    const taskDueDateValue = taskCard.querySelector(".card-body .text-muted").textContent.trim().replace("Due ", "");
    const taskEmailValue = taskCard.querySelector(".card-body .card-text:nth-child(2)").textContent.trim();
    console.log("Task ID:", taskId);
    console.log("Title:", taskTitleValue);
    console.log("Description:", taskDescriptionValue);
    console.log("Due date:", taskDueDateValue);
    console.log("Email:", taskEmailValue);
    console.log("Status:", $(`#${taskId}`).attr("data-status"));

    $('#add-modal').modal('show');
    taskTitle.val(taskTitleValue);
    taskDescription.val(taskDescriptionValue);
    const dateObj = new Date(taskDueDateValue);
    const formattedDate = dateObj.toISOString().slice(0, 10);
    taskDeadline.val(formattedDate);
    taskAssign.val(taskEmailValue);
    taskStatus.val($(`#${taskId}`).attr("data-status"));
    checkPoint = taskId;
}

const updateTaskInDB = async (taskData) => {
    try {
        console.log(taskData);
        showLoadIcon()
        const data = await $.ajax({
            url: 'http://localhost:5000/task/updateTask',
            type: 'PUT',
            data: JSON.stringify(taskData),
            headers: {
                'authorization': authorization,
                'Content-Type': 'application/json'
            }
        });
        hideLoadIcon()
        console.log("data");
        console.log(taskData);
        if (!data.validationErr) {
            checkPoint = '';
            return createTaskCard(data.task, true)
            // return location.reload();
        }
        alert("Some thing went wrong!")
    } catch (error) {
        console.log("catch======");
        $('#message').html('Error: ' + error);
        return null;
    }
}

const deleteTask = async (taskId) => {
    console.log(taskId);
    // Remove the task from DB
    const deleted = await deleteTaskFromDB(taskId);
    if (!deleted) {
        // return alert("Some thing went wrong!");
    }
    // Get the parent element of the button (i.e. the task card element)
    const taskCardElement = document.getElementById(taskId);
    console.log(taskCardElement);
    // Remove the task card element from the DOM
    taskCardElement.remove();
}

const deleteTaskFromDB = async (taskId) => {
    try {
        console.log(taskId);
        console.log(typeof (taskId));
        taskId = { taskId }
        console.log(taskId);
        showLoadIcon()
        const data = await $.ajax({
            url: 'http://localhost:5000/task/deleteTask',
            type: 'PUT',
            data: JSON.stringify(taskId),
            headers: {
                'authorization': authorization,
                'Content-Type': 'application/json'
            }
        });
        hideLoadIcon()
        console.log("data.status");
        console.log(data);
        if (data) {
            if (!data.validationErr) {
                return data.status == 202;
                // return location.reload();
            }
            return null;
        }
        return null;
    } catch (error) {
        console.log("catch======");
        $('#message').html('Error: ' + error);
        return null;
    }
}

// Events
// Events
addBtn.onclick = function () {
    $('#add-modal').modal('show');
}

taskForm.on("submit", async function (event) {
    event.preventDefault();
    const title = taskTitle.val();
    const description = taskDescription.val();
    const deadline = taskDeadline.val();
    const assignTo = taskAssign.val();
    const status = taskStatus.val();

    const taskData = { title, description, status, assignTo, deadline };
    const isValidated = makeValidation(taskData);
    if (isValidated) {
        console.log(checkPoint);
        checkPoint ? await updateTaskInDB({ title, description, status, assignTo, deadline, taskId: checkPoint })
            : await createTaskInDB(taskData);
        taskTitle.val("");
        taskDescription.val("");
        taskDeadline.val("");
        taskDeadline.val("");
        taskStatus.val("");
    }
});
$('#add-modal').on('hidden.bs.modal', function () {
    $(this).find('form').trigger('reset');
});

document.addEventListener('click', function (event) {
    var dropdownMenus = document.querySelectorAll('.dropdown-menu');
    dropdownMenus.forEach(function (dropdownMenu) {
        var dropdownTrigger = dropdownMenu.previousElementSibling;
        if (!dropdownMenu.contains(event.target) && event.target !== dropdownTrigger) {
            dropdownMenu.classList.remove('show');
        }
    });
});




// JavaScript code to show the confirmation pop-up message
function confirmRemove(taskId) {
    console.log(taskId);
    const popupHtml = `
        <div class="popup-content">
            <p>Are you sure you want to remove this Task?</p>
            <button id="popup-btn-ok" class="popup-btn-ok">Yes</button>
            <button class="popup-btn-cancel" onclick="cancelRemove()">Cancel</button>
        </div>
    `;

    // const parentElement = document.getElementById('confirmPopup');
    // console.log(parentElement);
    // parentElement.innerHTML += popupHtml;


    var popup = document.getElementById("confirmPopup");
    console.log(popup);
    popup.style.display = "block";

    const myButton = document.getElementById('popup-btn-ok');
    console.log(myButton);
    myButton.addEventListener('click', () => {
        proceedRemove(taskId);
    });
}



// JavaScript code to hide the confirmation pop-up message and proceed with the remove process
const proceedRemove = (taskId) => {
    console.log(taskId);
    let popup = document.getElementById("confirmPopup");
    popup.style.display = "none";
    // Add your remove code here
    deleteTask(taskId);
}

// JavaScript code to hide the confirmation pop-up message and cancel the remove process
const cancelRemove = () => {
    var popup = document.getElementById("confirmPopup");
    popup.style.display = "none";
}

const addEventListenerOnTask = (task) => {
    let taskMenus = document.getElementById(`dropdown-btn-${task.attr("id")}`);
    console.log(taskMenus);
    taskMenus.addEventListener("click", function () {
        const taskId = taskMenus.dataset.taskId.toString();
        console.log("Task ID:", taskId);
        const dropdownMenu = document.getElementById(`dropdown-menu-${taskId}`);
        console.log("Dropdown menu:", dropdownMenu);
        console.log("Parent element:", dropdownMenu.parentNode);
        if (dropdownMenu.classList.contains("show")) {
            dropdownMenu.classList.remove("show");
        } else {
            dropdownMenu.classList.add("show");
            const updateOption = dropdownMenu.querySelector("[value='update']");
            const deleteOption = dropdownMenu.querySelector("[value='delete']");
            updateOption.addEventListener("click", function () {
                const created = createUpdateForm(taskId);
                // Code to handle update option
                console.log("Update task:", taskId);
            });
            deleteOption.addEventListener("click", function () {
                const deleted = confirmRemove(taskId)
                // Code to handle delete option
                console.log("Delete task:", taskId);
            });
        }
    });
}

const logOut = async () => {
    try {
        console.log(authorization);
        showLoadIcon();
        const data = await $.ajax({
            url: 'http://localhost:5000/user/logOut',
            type: 'POST',
            headers: {
                'authorization': authorization,
                'Content-Type': 'application/json'
            }
        });
        hideLoadIcon()
        if (data.message === "Done!") {
            console.log(data);
            if (localStorage.getItem('token') !== null) {
                // if it exists, remove the value
                localStorage.removeItem('token');
            }
            // Redirect the user to the Main page
            window.location.href = "login.html";
        }
    } catch (error) {
        console.log("catch======", error);
        $('#message').html('Error: ' + error);
        return null;
    }
}

const confirmationLogOut = () => {
    var popup = document.getElementById("confirmLogOutPopup");
    console.log(popup);
    popup.style.display = "block";

    const myButton = document.getElementById('logOut-popup-btn-ok');
    console.log(myButton);
    myButton.addEventListener('click', () => {
        return logOut();
    });

}

// JavaScript code to hide the confirmation pop-up message and cancel the remove process
const cancelLogOutPopup = () => {
    var popup = document.getElementById("confirmLogOutPopup");
    popup.style.display = "none";
}

$(function () {
    window.onload = function (event) {
        event.preventDefault();
        popupConfirmMessage("Welcome!");
    };
});

const popupConfirmMessage = (message) => {
    $('#confirm-message').text(message);
    // Show the confirmation message
    $('#confirm-message').fadeIn();
    // $('#confirm-message').css(display, 'block');
    // $('#confirm-message')[0].style.display = 'block';

    // Hide the confirmation message after 1 second
    setTimeout(function () {
        $('#confirm-message').fadeOut();
    }, 3000);
}



const showLoadIcon = () => {
    document.getElementById('spinner').style.display = 'block';
    document.getElementById("spinner-container").style.display = 'flex';
}

const hideLoadIcon = () => {
    document.getElementById('spinner').style.display = 'none';
    document.getElementById("spinner-container").style.display = 'none';
}