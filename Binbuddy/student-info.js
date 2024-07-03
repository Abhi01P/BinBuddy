function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eye-icon');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.className = 'fa fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        eyeIcon.className = 'fa fa-eye';
    }
}

async function validateForm(event) {
    event.preventDefault();

    const course = document.getElementById("course").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;

    // Email validation
    const iitpEmailRegex = /^[a-zA-Z0-9._%+-]+@iitp\.ac\.in$/;
    if (course !== "other" && !iitpEmailRegex.test(email)) {
        alert("For courses other than 'other', email must end with '@iitp.ac.in'");
        return false;
    }

    // Phone number validation
    const phoneRegex = /^[1-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
        alert("Phone number must be exactly 10 digits and should not start with zero");
        return false;
    }

    const formData = {
        name: document.getElementById("name").value,
        gender: document.getElementById("gender").value,
        course: document.getElementById("course").value,
        hostel: document.getElementById("hostel").value,
        mess: document.getElementById("mess").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        password: password 
    };

    try {
        const response = await fetch('/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const responseText = await response.text();
        console.log('Server response:', responseText);

        if (response.ok) {
            window.location.href = "student-page.html";
        } else {
            alert("Error submitting form: " + responseText);
        }
    } catch (error) {
        console.error("Network error:", error);
        alert("Error submitting form: " + error.message);
    }
}

// document.getElementById('submitFormButton').addEventListener('click', function() {
//     var form = document.getElementById('studentForm');
//     var formData = new FormData(form);

//     fetch('/submit', {
//         method: 'POST',
//         body: new URLSearchParams(formData)
//     })
//     .then(response => response.text())
//     .then(result => {
//         if (result === 'OTP sent') {
//             document.getElementById('studentForm').style.display = 'none';
//             document.getElementById('otpSection').style.display = 'block';
//         } else {
//             alert('Error sending OTP');
//         }
//     })
//     .catch(error => console.error('Error:', error));
// });

// document.getElementById('verifyOtpButton').addEventListener('click', function() {
//     var email = document.getElementById('email').value;
//     var phone = document.getElementById('phone').value;
//     var otp = document.getElementById('otp').value;

//     fetch('/verify', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ email: email, phone: phone, otp: otp })
//     })
//     .then(response => response.text())
//     .then(result => {
//         if (result === 'OTP verified') {
//             alert('OTP verified successfully');
//             // You can redirect or perform any other actions here
//         } else {
//             alert('Invalid OTP');
//         }
//     })
//     .catch(error => console.error('Error:', error));
// });