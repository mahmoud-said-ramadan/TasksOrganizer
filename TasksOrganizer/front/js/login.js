$(document).ready(function () {
    $('#signup-form').on("submit", async function (event) {
        event.preventDefault();
        console.log("logIn-form");
        await getData();
        const isValidated = isValidEmailFormat();
        console.log(isValidated);
        if (isValidated) {
            console.log("if-----------isValidated");
            const user = await getUserFromDB();
            console.log("user---------------");
            console.log(user);
            if (user) {
                console.log("if -------------user");
                //Save Token In Local Storage
                localStorage.setItem('token', user.token);
                // Redirect the user to the Main page
                window.location.href = "main.html";
                return;
            }
            return notValidEmailOrPassword();
        }
    });
});


// email, password
// let userName = $("#userName");
let email = $("#email");
let password = $("#password");



async function getData() {
    // userName = $("#userName").val();
    email = $("#email").val();
    password = $("#password").val();
    console.log(email, password);
}

function isValidEmailFormat() {
    console.log("isValidEmail");
    // Regular expression for validating email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
        document.getElementById('email-error').innerText = ''
        return true;
    }
    document.getElementById('email-error').innerText = 'Enter A Valid Email Format';
    return false;
}

function notValidEmailOrPassword() {
    console.log("notValidEmailOrPassword");
    document.getElementById('emailOrPassword-error').innerText = `In-Valid Email Or Password!`;
}

const getUserFromDB = async () => {
    try {
        const userData = { value: email, password };
        showLoadIcon()
        const user = await $.ajax({
            url: 'http://localhost:5000/auth/logIn',
            type: 'POST',
            data: JSON.stringify(userData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        hideLoadIcon()
        console.log(user);
        if (user.validationErr) {
            document.getElementById('emailOrPassword-error').innerText = `Sould Enter A Valid Data!`;
            return false;
        }
        return user;
    } catch (error) {
        console.log("catch======");
        console.log(error.responseJSON.message);
        document.getElementById('emailOrPassword-error').innerText = `${error.responseJSON.message}`;
        return null;
    }
}




const showLoadIcon = () => {
    document.getElementById('spinner').style.display = 'block';
    document.getElementById("spinner-container").style.display = 'flex';
}

const hideLoadIcon = () => {
    document.getElementById('spinner').style.display = 'none';
    document.getElementById("spinner-container").style.display = 'none';
}