$(function () {
    $('#signup-form').on("submit", async function (event) {
        event.preventDefault();
        console.log("signup-form");
        await getData();
        const isValidated = makeValidation();
        console.log(isValidated);
        if (isValidated) {
            console.log("if-----------isValidated");
            showLoadIcon();
            const user = await sendUserToDB();
            hideLoadIcon();
            console.log("user---------------");
            console.log(user);

            if (!user.validationErr) {
                console.log("if -------------user");
                // let message = "Thank you for Registering! \n We have sent a confirmation email to your email address.\n Please check your inbox!";
                // var url = "../html/confirmation.html?message=" + encodeURIComponent(message);
                window.location.href = user.redirectUrl;

                // Redirect the user to the login page
                // window.location.href = "login.html";
            }
        }
    });
});


// userName, email, phone, password, age, gender
let userName = $("#userName");
let email = $("#email");
let phone = $("#phone");
let password = $("#password");
let cPassword = $("#confirm-password");
let age = $("#age");
let gender = $("#gender");


async function getData() {
    userName = $("#userName").val();
    email = $("#email").val();
    phone = $("#phone").val();
    password = $("#password").val();
    cPassword = $("#confirm-password").val();
    age = $("#age").val();
    gender = $("#gender").val();
    console.log(userName, email, phone, password, cPassword, age, gender);
}


const makeValidation = () => {
    // const { userName, phone, age, email, password, cPassword } = userData;
    // console.log(userData);
    let isValid = true;
    const userNameRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/;
    const phoneRegex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
    const ageRegex = /^1[2-9]|[2-9][0-9]|[1-9][0-9]{2}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;


    if (userName === '' || !userNameRegex.test(userName)) {
        document.getElementById('userName-error').innerText = "- Contains Letters and Numbers Only \n - At least One Letter";
        isValid = false;
    } else {
        document.getElementById('userName-error').innerText = '';
    }

    if (email === '' || !emailRegex.test(email)) {
        document.getElementById('email-error').innerText = "Enter A Valid Email";
        isValid = false;
    } else {
        document.getElementById('email-error').innerText = '';
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

    if (password === '' || !passwordRegex.test(password)) {
        document.getElementById('password-error').innerText = `- Contains at least one digit \n - Contains at least one lowercase letter \n - Contains at least one uppercase letter \n - Is at least 8 characters long`;
        isValid = false;
    } else {
        document.getElementById('password-error').innerText = '';
    }

    if (password !== cPassword) {
        document.getElementById('confirm-error').innerText = `Passwords Not Matched!`;
        isValid = false;
    } else {
        document.getElementById('confirm-error').innerText = '';
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

const sendUserToDB = async () => {
    try {
        const userData = { userName, email, phone, password, cPassword, age, gender };
        return await $.ajax({
            url: 'http://localhost:5000/auth/signUp',
            type: 'POST',
            data: JSON.stringify(userData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.log("catch======");
        $('#message').html('Error: ' + error);
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