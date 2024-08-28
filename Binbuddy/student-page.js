document.addEventListener('DOMContentLoaded', () => {
    loadStudentProfile();
    loadTodayMenu();
});

function loadStudentProfile() {
    fetch('/api/student-profile')
        .then(response => response.json())
        .then(data => {
            document.getElementById('welcome-message').innerText = data.name;
        })
        .catch(error => {
            console.error('Error fetching student profile:', error);
        });
}

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const currentDate = new Date();
const currentDay = days[currentDate.getDay()];

document.getElementById('currentDay').innerText = currentDay;

function loadTodayMenu() {
    fetch('/api/today-menu')
        .then(response => response.json())
        .then(data => {
            document.getElementById('breakfast-details').textContent = data.breakfast;
            document.getElementById('lunch-details').textContent = data.lunch;
            document.getElementById('dinner-details').textContent = data.dinner;
        })
        .catch(error => {
            console.error('Error fetching today\'s menu:', error);
        });

    fetch('/api/today-timing')
        .then(response => response.json())
        .then(data => {
            document.getElementById('breakfast-timing').textContent = `${data.breakfastStart} - ${data.breakfastEnd}`;
            document.getElementById('lunch-timing').textContent = `${data.lunchStart} - ${data.lunchEnd}`;
            document.getElementById('dinner-timing').textContent = `${data.dinnerStart} - ${data.dinnerEnd}`;
        })
        .catch(error => {
        console.error('Error fetching today\'s timings:', error);
        });
}

function toggleMenu() {
    const hoverContent = document.getElementById('hover-content');
    hoverContent.style.display = hoverContent.style.display === 'block' ? 'none' : 'block';
}

document.addEventListener('click', function(event) {
    const hoverContent = document.getElementById('hover-content');
    const hoverMain = document.querySelector('.hover-main');
    if (!hoverMain.contains(event.target) && !hoverContent.contains(event.target)) {
        hoverContent.style.display = 'none';
    }
});

function showProfileModal() {
    loadProfile();
    document.getElementById('profile-modal').style.display = 'block';
}

function closeProfileModal() {
    document.getElementById('profile-modal').style.display = 'none';
}

async function loadProfile() {
    try {
        const response = await fetch('/api/getFormData?type=student');
        if (response.ok) {
            const profile = await response.json();
            document.getElementById('profile-name').textContent = profile.name;
            document.getElementById('profile-email-text').textContent = profile.email;
            document.getElementById('profile-phone-text').textContent = profile.phone;
            document.getElementById('profile-hostel-text').textContent = profile.hostel;
            document.getElementById('profile-mess-text').textContent = profile.mess;
        } else {
            console.error('Failed to load profile:', await response.text());
            alert('Failed to load profile.');
        }
    } catch (error) {
        console.error('Error loading profile:', error);
        alert('Error loading profile.');
    }
}

function editField(field) {
    const textElement = document.getElementById(`${field}-text`);
    const inputElement = document.getElementById(`${field}-input`);
    const saveButton = document.getElementById(`save-${field}`);
    const editButtons = document.querySelectorAll('.profile-detail button:not([id^="save-"])');

    textElement.style.display = 'none';
    inputElement.style.display = 'inline';
    saveButton.style.display = 'inline';

    inputElement.value = textElement.textContent;

    // Hide other save buttons
    editButtons.forEach(button => {
        if (button !== saveButton.previousElementSibling) {
            const fieldName = button.getAttribute('onclick').match(/'(.*?)'/)[1];
            document.getElementById(`${fieldName}-input`).style.display = 'none';
            document.getElementById(`${fieldName}-text`).style.display = 'inline';
            document.getElementById(`save-${fieldName}`).style.display = 'none';
        }
    });
}

async function saveProfile(field) {
    const inputElement = document.getElementById(`profile-${field}-input`);
    const value = inputElement.value;
    const profileData = { [field]: value };

    try {
        const response = await fetch('/api/updateProfile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData)
        });

        if (response.ok) {
            alert('Profile updated successfully!');
            closeProfileModal();
            loadProfile(); // Refresh the profile details
        } else {
            console.error('Failed to update profile:', await response.text());
            alert('Failed to update profile.');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile.');
    }
}