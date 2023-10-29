const token = localStorage.getItem('token');
const authorization = `kokoz ${token}`;
let user = {};
$(async function () {
    showLoadIcon();
    await getUserDataFromDB();
    addUserDataToProfile();
    hideLoadIcon();

    $('#profile-picture-input').change(function () {
        var file = this.files[0];
        var reader = new FileReader();
        reader.onloadend = function () {
            $('.profile-picture').attr('src', reader.result);
        }
        reader.readAsDataURL(file);
    });
});

// Activate the current nav item
const currentLocation = location.href;
const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
const navLength = navLinks.length;
for (let i = 0; i < navLength; i++) {
    if (navLinks[i].href === currentLocation) {
        navLinks[i].classList.add("active");
    }
}

const getUserDataFromDB = async () => {
    try {
        console.log(authorization);
        const data = await $.ajax({
            url: 'http://localhost:5000/user/getUserData',
            type: 'GET',
            headers: {
                'authorization': authorization,
                'Content-Type': 'application/json'
            }
        });
        if (data?.user) {
            return user = data.user;
        }
        return alert("Something Went Wrong!");
    } catch (error) {
        console.log("catch======", error);
        $('#message').html('Error: ' + error);
        return null;
    }
}

const addUserDataToProfile = () => {
    const { userName, phone, age, email } = user;
    console.log(user);
    $("#username").val(userName);
    $("#phone").val(phone);
    $("#age").val(age);
    $("#userName-p").text(userName);
    $("#email-p").text(email);
}



const editPersonalData = () => {
    const userData = getDataToEdit();
    console.log(userData);
    const { userName, phone, age } = userData;
    $("#userName-input").val(userName);
    $("#phone-input").val(phone);
    $("#age-input").val(age);
}

const getDataToEdit = () => {
    const userName = $("#username").val();
    const phone = $("#phone").val();
    const age = $("#age").val();
    return { userName, phone, age };
}

const saveChanges = async () => {
    try {
        const userData = getDataFromForm();
        const isValidData = makeValidation(userData);
        if (!isValidData) {
            return;
        }
        console.log(authorization);
        showLoadIcon();
        const data = await $.ajax({
            url: 'http://localhost:5000/user/updateUser',
            type: 'PUT',
            data: JSON.stringify(userData),
            headers: {
                'authorization': authorization,
                'Content-Type': 'application/json'
            }
        });
        hideLoadIcon();
        if (data.message === "Done!") {
            console.log(data);
            showLoadIcon();
            await getUserDataFromDB();
            addUserDataToProfile();
            hideLoadIcon();
            $("#edit-personal-info-modal").modal('hide');
            return;
        }
        return alert("Something Went Wrong!");
    } catch (error) {
        console.log("catch======", error);
        $('#message').html('Error: ' + error);
        return null;
    }

}

const getDataFromForm = () => {
    const userName = $("#userName-input").val();
    const phone = $("#phone-input").val();
    const age = $("#age-input").val();
    return { userName, phone, age };
}


const makeValidation = (userData) => {
    const { userName, phone, age } = userData;
    console.log(userData);
    let isValid = true;
    const userNameRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/;
    const phoneRegex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
    const ageRegex = /^1[2-9]|[2-9][0-9]|[1-9][0-9]{2}$/;

    if (userName === '' || !userNameRegex.test(userName)) {
        document.getElementById('userName-error').innerText = "- Contains Letters and Numbers Only \n - At least One Letter";
        isValid = false;
    } else {
        document.getElementById('userName-error').innerText = '';
        console.log("fd");

    }

    // Validate phone field
    if (phone === '' || !phoneRegex.test(phone)) {
        document.getElementById('phone-error').innerText = 'Enter A Valid Phone Number';
        isValid = false;
    } else {
        document.getElementById('phone-error').innerText = '';
    }

    // Validate age field
    if (age === '' || !ageRegex.test(age)) {
        document.getElementById('age-error').innerText = 'Age Must Be Valid';
        isValid = false;
    } else {
        document.getElementById('age-error').innerText = '';
    }

    // // Validate status field
    // if (status === '') {
    //     document.getElementById('status-error').textContent = 'Status is required';
    //     isValid = false;
    // } else {
    //     document.getElementById('status-error').textContent = '';
    // }

    // // Validate assign field
    // if (assignTo === '') {
    //     document.getElementById('assign-error').textContent = 'AssignTo is required';
    //     isValid = false;
    // } else if (!isValidEmail(assignTo)) {
    //     document.getElementById('assign-error').textContent = 'Invalid email address';
    //     isValid = false;
    // } else {
    //     document.getElementById('assign-error').textContent = '';
    // }

    // If the form inputs are valid, submit the form
    if (isValid) {
        // taskForm.submit();
        // $('#add-modal').modal('hide');
        return isValid;
    }
    else {
        console.log("errorsssss");
    }
}


const savePasswordChanges = async () => {
    try {
        const userPasswords = getPassword();
        const isValidData = makeValidationOnPasswords(userPasswords);
        if (!isValidData) {
            return;
        }
        console.log(authorization);
        showLoadIcon();
        const data = await $.ajax({
            url: 'http://localhost:5000/user/changePassword',
            type: 'PUT',
            data: JSON.stringify({
                oldPassword: userPasswords.currentPassword,
                newPassword: userPasswords.newPassword,
                cNewPassword: userPasswords.cNewPassword
            }),
            headers: {
                'authorization': authorization,
                'Content-Type': 'application/json'
            }
        });
        hideLoadIcon();
        if (data.message === "Done!") {
            console.log(data);
            $("#reset-password-modal").modal('hide');
            return;
        }
        if (data?.validationErr) {
            data.validationErr.forEach(element => {
                console.log(element.key);
            });
            return console.log(data.validationErr);
        }
        return alert("Something Went Wrong!");
    } catch (error) {
        console.log("catch======", error);
        $('#message').html('Error: ' + error);
        return null;
    }

}

const getPassword = () => {
    const currentPassword = $("#current-password-input").val();
    const newPassword = $("#new-password-input").val();
    const cNewPassword = $("#confirm-password-input").val();
    return { currentPassword, newPassword, cNewPassword };
}

const makeValidationOnPasswords = (userData) => {
    const { currentPassword, newPassword, cNewPassword } = userData;
    console.log(userData);
    let isValid = true;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    // Validate currentPassword field
    if (currentPassword === '') {
        document.getElementById('age-error').innerText = 'Should Enter The Current Password';
        isValid = false;
    } else {
        document.getElementById('age-error').innerText = '';
    }
    // Validate newPassword field
    if (newPassword === '' || !passwordRegex.test(newPassword)) {
        document.getElementById('newPassword-error').innerText = `- Contains at least one digit \n - Contains at least one lowercase letter \n - Contains at least one uppercase letter \n - Is at least 8 characters long`;
        isValid = false;
    } else {
        document.getElementById('newPassword-error').innerText = '';
    }

    // Validate cNewPassword field
    if (cNewPassword === '' || !newPassword === cNewPassword) {
        document.getElementById('cNewPassword-error').innerText = 'Passwords Not Matched!';
        isValid = false;
    } else {
        document.getElementById('cNewPassword-error').innerText = '';
    }
    // If the form inputs are valid, submit the form
    if (isValid) {
        // taskForm.submit();
        // $('#add-modal').modal('hide');
        return isValid;
    }
    else {
        console.log("errorsssss");
    }
}


document.getElementById("edit-btn").addEventListener("click", editPersonalData);
document.getElementById("save-btn").addEventListener("click", saveChanges);

document.getElementById("reset-password").addEventListener("click", savePasswordChanges);




function isValidPassword() {
    console.log("isValidPassword");

    // Regular expression for validating password addresses
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (passwordRegex.test(password)) {
        document.getElementById('password-error').innerText = '';
        return true;
    }
    document.getElementById('password-error').innerText = `- Contains at least one digit \n - Contains at least one lowercase letter \n - Contains at least one uppercase letter \n - Is at least 8 characters long`;
    return false;
}

function isPasswordMatches() {
    console.log("isPasswordMatches");

    if (password === cPassword) {
        document.getElementById('confirm-error').innerText = '';
        return true;
    }
    document.getElementById('confirm-error').innerText = 'Passwords Not Matched!';
    return false;
}


$(document).on('click', function (event) {
    // Check if the click event was triggered outside of the modal
    if ($(event.target).closest('#edit-personal-info-modal').length === 0) {
        // Do something here, such as hiding the modal
        $('#edit-personal-info-modal').modal('hide');
        $('#userName-error').text('');
        $('#age-error').text('');
        $('#phone-error').text('');
    }
});

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
        hideLoadIcon();
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



const showLoadIcon = () => {
    document.getElementById('spinner').style.display = 'block';
    document.getElementById("spinner-container").style.display = 'flex';
}

const hideLoadIcon = () => {
    document.getElementById('spinner').style.display = 'none';
    document.getElementById("spinner-container").style.display = 'none';
}