// src/js/profile.js

const profileSection = document.getElementById('profile-section');
const profilePictureEl = document.getElementById('profile-picture');
const profilePictureInput = document.getElementById('profile-picture-input');
const bioInput = document.getElementById('bio-input');
const saveProfileBtn = document.getElementById('save-profile-btn');

function showProfile(user) {
    profileSection.style.display = 'block';
    profilePictureEl.src = user.profilePicture || 'default-profile.png';
    bioInput.value = user.bio || '';
}

function saveProfile(user) {
    const file = profilePictureInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            user.profilePicture = e.target.result; // Save the image as a base64 string
            updateUser(user);
            profilePictureEl.src = user.profilePicture;
            alert('Profile picture updated successfully!');
        };
        reader.readAsDataURL(file);
    }

    user.bio = bioInput.value.trim();
    updateUser(user);
    alert('Bio updated successfully!');
}

saveProfileBtn.addEventListener('click', () => {
    const currentUser = findUser(getSession());
    if (currentUser) {
        saveProfile(currentUser);
    }
});