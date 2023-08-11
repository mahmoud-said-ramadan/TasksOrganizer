const logOut = async () => {
    try {
        console.log(authorization);
        const data = await $.ajax({
            url: 'http://localhost:5000/user/logOut',
            type: 'POST',
            headers: {
                'authorization': authorization,
                'Content-Type': 'application/json'
            }
        });
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
    const popupHtml = `
        <div class="popup-content">
            <p>Are you sure you want to logOut?</p>
            <button id="logOut-popup-btn-ok" class="popup-btn-ok">Yes</button>
            <button class="popup-btn-cancel" onclick="cancelLogOutPopup()" >Cancel</button>
        </div>
    `;

    const parentElement = document.getElementById('confirmLogOutPopup');
    console.log(parentElement);
    parentElement.innerHTML += popupHtml;

    var popup = document.getElementById("logOutPopup");
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
    var popup = document.getElementById("logOutPopup");
    popup.style.display = "none";
}

// window.addEventListener('DOMContentLoaded', function () {
//     const logoutButton = document.getElementById("logout");
//     if (logoutButton) {
//         logoutButton.addEventListener("click", logOut);
//     }
// });